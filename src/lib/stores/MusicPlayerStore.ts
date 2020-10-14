import { action, makeObservable, observable, runInAction } from 'mobx'
import { Howl } from 'howler'
import { RadioStation } from '../../types'

export const PlayerStatus = {
  PLAYING: 'PLAYING',
  BUFFERING: 'BUFFERING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED'
} as const

export class MusicPlayerStore {
  status: keyof typeof PlayerStatus = PlayerStatus.STOPPED

  playerError: {
    type: 'load' | 'play'
    data: any
  } | null = null

  stationID = ''

  station: RadioStation | null = null

  protected player: Howl | null = null

  constructor() {
    makeObservable<MusicPlayerStore, 'disposePlayer' | 'initPlayer'>(this, {
      status: observable,
      stationID: observable,
      playerError: observable,
      play: action,
      stop: action,
      pause: action,
      resume: action,
      disposePlayer: action,
      initPlayer: action
    })
  }

  getStation() {
    return this.station
  }

  protected initPlayer(station: RadioStation) {
    this.player = new Howl({
      html5: true,
      src: [station.url],
      format: [station.codec]
    })

    this.stationID = station.id

    this.player.on('play', () => {
      console.log('radio playing')
      runInAction(() => {
        this.status = PlayerStatus.PLAYING
        this.playerError = null
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
      console.log(this.playerError)
      this.playerError = {
        type: 'load',
        data: errorData
      }
      this.status = PlayerStatus.STOPPED
    })
    this.player.on('playerror', (_, errorData) => {
      console.log('radio playerror')
      console.log(this.playerError)

      this.playerError = {
        type: 'play',
        data: errorData
      }
      this.status = PlayerStatus.STOPPED
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
    this.disposePlayer()
    this.status = PlayerStatus.STOPPED
    this.stationID = ''
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
