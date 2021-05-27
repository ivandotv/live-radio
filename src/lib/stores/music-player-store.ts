import { Howl } from 'howler'
import { SongInfoService } from 'lib/services/song-info-service'
import { AppStorage } from 'lib/services/storage/app-storage-service'
import { RadioStation } from 'lib/station-utils'
import { RootStore } from 'lib/stores/root-store'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { RadioBrowserApi } from 'radio-browser-api'

export const PlayerStatus = {
  PLAYING: 'PLAYING',
  BUFFERING: 'BUFFERING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED',
  ERROR: 'ERROR'
} as const

export class MusicPlayerStore {
  status: keyof typeof PlayerStatus = PlayerStatus.STOPPED

  playerError: {
    type: 'load' | 'play'
    data: any
  } | null = null

  // station!: RadioStation

  initialized = false

  songInfo: { artist: string; title: string } | undefined = undefined

  prevSongInfo: { artist: string; title: string } | undefined = undefined

  stationChecked = false

  errorStations: { [key: string]: boolean } = {}

  protected stationClickTimeoutId: number | undefined

  protected stationClickDelay = 10000

  protected player: Howl | undefined = undefined

  protected firstTryLoad = true

  // TODO - this should be a state machine
  constructor(
    protected rootStore: RootStore,
    protected storage: AppStorage,
    protected songInfoService: SongInfoService,
    public station: RadioStation,
    protected radioApi: RadioBrowserApi
  ) {
    makeObservable<
      MusicPlayerStore,
      'disposePlayer' | 'initPlayer' | 'songServiceCb'
    >(this, {
      status: observable,
      // stationID: observable,
      station: observable.ref,
      stationChecked: observable,
      playerError: observable,
      songInfo: observable,
      prevSongInfo: observable,
      errorStations: observable.shallow,
      songServiceCb: action,
      play: action,
      stop: action,
      pause: action,
      resume: action,
      disposePlayer: action,
      initPlayer: action
    })

    // this.station = defaultStation
  }

  async init() {
    if (this.initialized) return Promise.resolve()
    this.initialized = true

    try {
      const station = await this.storage.getLastPlayedStation()
      runInAction(() => {
        if (station) {
          this.station = station
        }
      })
    } catch {
      //noop
    }
  }

  protected songServiceCb(
    error: Error | null,
    data?: { artist: string; title: string }
  ) {
    if (error) {
      console.log('player - song service error')
      console.error(error)
    } else {
      console.log('player - song service success')
      console.log(data)
      if (data) {
        if (
          data.title &&
          data.title !== this.songInfo?.title &&
          data.artist &&
          data.artist !== this.songInfo?.artist
        ) {
          console.log('new song data')
          console.log(`new ${data.title} | ${data.artist}`)
          console.log(
            `old ${this.prevSongInfo?.title} | ${this.prevSongInfo?.artist}`
          )
        }
      }
    }
    this.stationChecked = true
    this.prevSongInfo = this.songInfo
    this.songInfo = data
  }

  protected initPlayer(station: RadioStation, url?: string) {
    this.player = new Howl({
      html5: true,
      src: [url ?? station.url],
      format: [station.codec]
    })

    this.station = station

    console.log('trying ', url ?? station.url)

    this.player.on('play', () => {
      console.log('radio playing')
      this.songInfoService.start(station.url, this.songServiceCb.bind(this))
      this.firstTryLoad = true
      clearTimeout(this.stationClickTimeoutId)
      this.stationClickTimeoutId = window.setTimeout(() => {
        runInAction(() => {
          if (
            this.status === PlayerStatus.PLAYING ||
            this.status === PlayerStatus.BUFFERING
          ) {
            this.radioApi
              .sendStationClick(this.station.id)
              .catch((_e: Error) => {
                //todo - log error
              })
          }
        })
        this.stationClickTimeoutId = undefined
      }, this.stationClickDelay)

      runInAction(() => {
        this.stationChecked = false
        this.status = PlayerStatus.PLAYING
        this.playerError = null
        this.errorStations[station.id] = false
      })

      // this.storage.setLastPlayedStation(this.station)
      this.storage.addRecentStation(this.station)
    })

    this.player.on('pause', () => {
      console.log('radio paused')
      runInAction(() => {
        this.status = PlayerStatus.PAUSED
      })
    })

    this.player.on('load', () => {
      console.log('radio load')
    })

    this.player.on('loaderror', (_, errorData) => {
      console.log('radio loaderror')
      console.log('error data')
      console.log(errorData)
      console.log(_)
      if (this.firstTryLoad) {
        this.firstTryLoad = false
        this.disposePlayer()
        //try to fix station url
        const url = `${this.station.url}${
          this.station.url.lastIndexOf('/') === this.station.url.length
            ? ';'
            : '/;' //shoutcast stream fix
        }`

        console.log('trying new url ', url)
        this.initPlayer(this.station, url)

        return
      }
      runInAction(() => {
        this.playerError = {
          type: 'load',
          data: errorData
        }
        this.status = PlayerStatus.ERROR
        this.errorStations[station.id] = true
        console.log(this.playerError)
      })
    })
    this.player.on('playerror', (_, errorData) => {
      console.log('radio playerror')
      runInAction(() => {
        this.playerError = {
          type: 'play',
          data: errorData
        }
        this.status = PlayerStatus.ERROR
        this.errorStations[station.id] = true
        console.log(this.playerError)
      })
    })

    this.player.play()
    this.status = PlayerStatus.BUFFERING
  }

  protected disposePlayer() {
    if (this.player) {
      this.player.unload()
      this.player.off()
    }
  }

  play(station: RadioStation) {
    if (this.player) {
      this.stop()
    }
    this.initPlayer(station)
  }

  stop() {
    this.status = PlayerStatus.STOPPED
    this.songInfoService.stop()
    this.firstTryLoad = true

    this.prevSongInfo = undefined
    this.songInfo = undefined
    this.stationChecked = false
    this.disposePlayer()
  }

  pause() {
    console.log('player-> pause')
    this.player!.pause()
  }

  togglePlay(station?: RadioStation) {
    station = station || this.station
    if (!station) {
      throw new Error('Player has no station to play')
    }

    if (this.station?.id === station.id) {
      // same station
      if (
        this.status === PlayerStatus.STOPPED ||
        this.status === PlayerStatus.ERROR
      ) {
        this.play(station)
      } else if (this.status === PlayerStatus.PAUSED) {
        this.resume()
      } else {
        // buffering or playing
        this.stop()
      }
    } else {
      // new station
      this.play(station)
    }
  }

  resume() {
    console.log('player-> resume')
    this.player!.play()
  }

  async getStationInfo(id: string) {
    const response = await fetch(
      `/api/station-info?play=${encodeURIComponent(id)}`
    )

    if (response.ok) {
      return response.json()
    } else {
      throw new Error()
    }
  }
}
