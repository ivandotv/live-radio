import { action, makeObservable, observable, runInAction } from 'mobx'
import { Howl } from 'howler'
import { RadioStation } from '../../types'
import { AppStorage } from '../Storage'
import { SongInfoService } from '../SongInfoService'

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

  // stationID = ''

  station: RadioStation | undefined = undefined

  songInfo: { artist: string; title: string } | undefined = undefined

  prevSongInfo: { artist: string; title: string } | undefined = undefined

  protected player: Howl | undefined = undefined

  stationChecked = false

  errorStations: { [key: string]: boolean } = {}

  constructor(
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
      console.log('player - error')
      // console.log(error)
    } else {
      console.log('player success')
      console.log(data)
      if (data) {
        if (
          data.title !== this.songInfo?.title &&
          data.artist !== this.songInfo?.artist
        ) {
          // song info has changed
          // fetch artwork
          console.log('we have new song data')
          console.log(`new ${data.title} | ${data.artist}`)
          console.log(`old ${this.songInfo?.title} | ${this.songInfo?.artist}`)
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
    // this.stationID = station.id

    this.player.on('play', () => {
      console.log('radio playing')
      this.songInfoService.start(station.url, this.songServiceCb.bind(this))
      runInAction(() => {
        this.stationChecked = false
        this.status = PlayerStatus.PLAYING
        this.playerError = null
        this.errorStations[station.id] = undefined
      })
    })

    this.player.on('pause', () => {
      console.log('>>> radio pause')
      runInAction(() => {
        this.status = PlayerStatus.PAUSED
      })
      // alert('paused')
    })

    // this is handled in the stop method
    // this.player.on('stop', () => {
    //   console.log('radio stop')
    //   this.status = 'stopped'
    // })

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
    /*
     if status.paused.
      check if id is the same as paused id
      if true:
        resume playing
      else:
       new player
    */
    if (this.player) {
      // this.player.stop()
      this.disposePlayer()
      // this.player.unload()
    }
    this.initPlayer(station)
    // window.setInterval(() => {
    //   console.log('check state', this.player?.state())
    // }, 500)
  }

  stop() {
    this.status = PlayerStatus.STOPPED
    this.songInfoService.stop()

    this.prevSongInfo = this.songInfo
    this.songInfo = undefined
    this.stationChecked = false
    this.disposePlayer()
    // this.stationID = ''
  }

  togglePlay(station?: RadioStation) {
    station = station || this.station
    if (!station) {
      throw new Error('Player has no station to play')
    }

    // if (
    //   (this.station &&
    //     this.station.id === station.id &&
    //     this.status !== PlayerStatus.STOPPED) ||
    //   this.status !== PlayerStatus.ERROR
    // ) {
    //   this.stop()
    // } else {
    //   if (
    //     this.status === PlayerStatus.PLAYING ||
    //     this.status === PlayerStatus.BUFFERING
    //   ) {
    //     this.stop()
    //   }
    //   this.play(station)
    // }

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
    // todo cannot resume after stopping
    console.log('player-> resume')

    this.player!.play()
  }

  pause() {
    console.log('try to pause')
    this.player!.pause()
  }
}
