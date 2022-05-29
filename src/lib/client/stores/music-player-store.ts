import { Howl } from 'howler'
import { injectionTokens } from 'lib/client/injection-tokens'
import { logger } from 'lib/client/logger-browser'
import { SongInfoService } from 'lib/client/services/song-info-service'
import { SharedConfig } from 'lib/shared/config'
import { RadioDTO } from 'lib/shared/utils'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { transform } from 'pumpit'
import { AppShellStore } from './app-shell-store'
import { RadioStore } from './radio-store'

const storeLogger = logger.child({ label: 'music-store' })

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

  songInfo: { artist: string; title: string } | undefined = undefined

  prevSongInfo: { artist: string; title: string } | undefined = undefined

  stationChecked = false

  errorStations: Record<string, boolean> = {}

  protected stationClickTimeoutId: number | undefined

  protected countStationClickDelay = 5000

  protected player: Howl | undefined = undefined

  protected firstTryLoad = true

  static inject = transform(
    [
      AppShellStore,
      injectionTokens.recentRadioStore,
      SongInfoService,
      'sharedConfig'
    ],
    (_, shell: any, store: any, songInfo: any, config: SharedConfig) => {
      return [shell, store, songInfo, config.defaultStation]
    }
  )

  // TODO - refactor to a state machine
  constructor(
    protected appShell: AppShellStore,
    protected recentStations: RadioStore,
    protected songInfoService: SongInfoService,
    public station: RadioDTO
  ) {
    makeObservable<
      MusicPlayerStore,
      'disposePlayer' | 'initPlayer' | 'songServiceCb'
    >(this, {
      status: observable,
      station: observable.ref,
      stationChecked: observable,
      playerError: observable,
      songInfo: observable,
      prevSongInfo: observable,
      errorStations: observable.shallow,
      songServiceCb: action,
      setStation: action,
      play: action,
      stop: action,
      pause: action,
      resume: action,
      disposePlayer: action,
      initPlayer: action
    })

    this.setStation(station)
  }

  protected songServiceCb(
    error: Error | null,
    data?: { artist: string; title: string }
  ) {
    if (error) {
      storeLogger.error('song service error', error)
    } else {
      if (data) {
        if (
          data.title &&
          data.title !== this.songInfo?.title &&
          data.artist &&
          data.artist !== this.songInfo?.artist
        ) {
          storeLogger.log(
            'new song data',
            `title ${data.title} | ${data.artist}`
          )
        }
      }
    }
    this.stationChecked = true
    this.prevSongInfo = this.songInfo
    this.songInfo = data
  }

  setStation(station: RadioDTO) {
    this.station = station
  }

  protected initPlayer(station: RadioDTO, url?: string) {
    this.player = new Howl({
      html5: true,
      src: [url ?? station.url],
      format: [station.codec]
    })

    this.station = station

    this.player.on('play', () => {
      this.songInfoService.start(station.url, this.songServiceCb.bind(this))
      this.firstTryLoad = true
      window.navigator.mediaSession!.playbackState = 'playing'

      clearTimeout(this.stationClickTimeoutId)
      this.stationClickTimeoutId = window.setTimeout(() => {
        if (
          this.status === PlayerStatus.PLAYING ||
          this.status === PlayerStatus.BUFFERING
        ) {
          this.appShell.countStationClick(station._id)
        }
        this.stationClickTimeoutId = undefined
      }, this.countStationClickDelay)

      runInAction(() => {
        this.stationChecked = false
        this.status = PlayerStatus.PLAYING
        this.playerError = null
        this.errorStations[station._id] = false
      })

      this.recentStations.saveStation(station)
    })

    this.player.on('pause', () => {
      runInAction(() => {
        this.status = PlayerStatus.PAUSED
      })
      window.navigator.mediaSession!.playbackState = 'paused'
    })

    this.player.on('load', () => {
      storeLogger.log('player loaded')
    })

    this.player.on('loaderror', (_, errorData) => {
      storeLogger.error('radio error', errorData)
      if (this.firstTryLoad) {
        this.firstTryLoad = false
        this.disposePlayer()
        //try to fix station url
        const url = `${this.station.url}${
          this.station.url.lastIndexOf('/') === this.station.url.length
            ? ';'
            : '/;' //shoutcast stream fix
        }`

        storeLogger.log('trying new url ', url)
        this.initPlayer(this.station, url)

        window.navigator.mediaSession!.playbackState = 'paused'

        return
      }
      runInAction(() => {
        this.playerError = {
          type: 'load',
          data: errorData
        }
        this.status = PlayerStatus.ERROR
        this.errorStations[station._id] = true
      })
    })

    this.player.on('playerror', (_, errorData) => {
      runInAction(() => {
        this.playerError = {
          type: 'play',
          data: errorData
        }
        this.status = PlayerStatus.ERROR
        this.errorStations[station._id] = true
      })

      window.navigator.mediaSession!.playbackState = 'paused'
      storeLogger.error('player error', errorData)
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

  play(station: RadioDTO) {
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
    this.player!.pause()
  }

  togglePlay(station?: RadioDTO) {
    station = station || this.station
    if (!station) {
      throw new Error('Player has no station to play')
    }

    if (this.station?._id === station._id) {
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
    this.player!.play()
  }
}
