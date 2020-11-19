import { action, makeObservable, observable, runInAction } from 'mobx'
import { Howl } from 'howler'
import { RadioStation } from 'types'
import { AppStorage } from 'lib/Storage'
import { SongInfoService } from 'lib/SongInfoService'
import { RootStore } from 'lib/stores/RootStore'

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

  station: RadioStation

  songInfo: { artist: string; title: string } | undefined = undefined

  prevSongInfo: { artist: string; title: string } | undefined = undefined

  protected player: Howl | undefined = undefined

  stationChecked = false

  errorStations: { [key: string]: boolean } = {}

  constructor(
    protected rootStore: RootStore,
    protected storage: AppStorage,
    protected songInfoService: SongInfoService
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
    this.station = this.storage.getLastUsedStation()
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

  protected initPlayer(station: RadioStation) {
    this.player = new Howl({
      html5: true,
      src: [station.url],
      format: [station.codec]
    })

    this.station = station

    this.player.on('play', () => {
      console.log('radio playing')
      this.songInfoService.start(station.url, this.songServiceCb.bind(this))
      runInAction(() => {
        this.stationChecked = false
        this.status = PlayerStatus.PLAYING
        this.playerError = null
        this.errorStations[station.id] = false
      })
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
    this.player!.unload()
    this.player!.off()
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

    if (this.station && this.station.id === station.id) {
      // same station
      if (
        this.status === PlayerStatus.STOPPED ||
        this.status === PlayerStatus.ERROR
      ) {
        this.play(station)
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
}
