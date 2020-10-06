import { action, makeObservable, observable, runInAction } from 'mobx'
import { Howl } from 'howler'
import { RadioStation } from '../../components/app/ListStations'

export class MusicPlayerStore {
  status: 'playing' | 'buffering' | 'stopped' | 'paused' = 'stopped'

  playerError: {
    type: 'load' | 'play'
    data: any
  } | null = null

  stationUUID = ''

  station: RadioStation | null = null

  protected player: Howl | null = null

  constructor() {
    makeObservable(this, {
      status: observable,
      stationUUID: observable,
      playerError: observable,
      play: action,
      stop: action,
      pause: action,
      resume: action,
      // @ts-ignore - protected methods
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

    this.stationUUID = station.uuid

    this.player.on('play', () => {
      console.log('radio playing')
      runInAction(() => {
        this.status = 'playing'
        this.playerError = null
      })
    })

    this.player.on('pause', () => {
      console.log('>>> radio pause')
      runInAction(() => {
        this.status = 'paused'
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
    })
    this.player.on('playerror', (_, errorData) => {
      console.log('radio playerror')
      console.log(this.playerError)

      this.playerError = {
        type: 'play',
        data: errorData
      }
    })

    this.player.play()
    this.status = 'buffering'
  }

  protected disposePlayer() {
    this.player!.unload()
    this.player!.off()
  }

  play(station: RadioStation) {
    /*
     if status.paused.
      check if uuid is the same as paused id
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
    this.status = 'stopped'
    this.stationUUID = ''
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
