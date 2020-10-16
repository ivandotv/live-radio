import { action, makeObservable, observable, runInAction } from 'mobx'
import { Howl } from 'howler'
import { RadioStation } from '../../types'

export const PlayerStatus = {
  PLAYING: 'PLAYING',
  BUFFERING: 'BUFFERING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED'
} as const

const defaultStation: RadioStation = {
  id: 'ae503431-073b-499d-81e9-c32dfa1e32c',
  name: 'Soma FM',
  url: 'http://ice1.somafm.com/groovesalad-256-mp3',
  homepage: 'http://www.somafm.com/',
  favicon: 'https://somafm.com/',
  country: 'Internet',
  countryCode: '',
  tags: [],
  language: [],
  codec: 'MP3',
  flag: '',
  continent: '',
  continentCode: ''
}

export class MusicPlayerStore {
  status: keyof typeof PlayerStatus = PlayerStatus.STOPPED

  playerError: {
    type: 'load' | 'play'
    data: any
  } | null = null

  // stationID = ''

  station: RadioStation | undefined = undefined

  protected player: Howl | undefined = undefined

  constructor() {
    makeObservable<MusicPlayerStore, 'disposePlayer' | 'initPlayer'>(this, {
      status: observable,
      // stationID: observable,
      station: observable.ref,
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

    this.station = station
    // this.stationID = station.id

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
    // this.stationID = ''
  }

  togglePlay(station?: RadioStation) {
    station = station || this.station

    if (!station) {
      throw new Error('Player has no station to play')
    }

    if (
      this.station &&
      this.station.id === station.id &&
      this.status !== PlayerStatus.STOPPED
    ) {
      this.stop()
    } else {
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
