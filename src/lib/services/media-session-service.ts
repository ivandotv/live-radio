import { reaction } from 'mobx'
import { MusicPlayerStore, PlayerStatus } from 'lib/stores/music-player-store'

export class MediaSessionService {
  constructor(
    protected musicPlayer: MusicPlayerStore,
    protected navigator: Navigator
  ) {
    reaction(
      () => this.musicPlayer.status,
      (status: string) => {
        if (this.assertMediaSession(this.navigator.mediaSession)) {
          if (status != PlayerStatus.PLAYING) {
            this.navigator.mediaSession.metadata = new MediaMetadata({
              title: this.musicPlayer.station.name,
              artist: undefined,
              album: undefined
            })
          }
        }
      }
    )

    reaction(
      () => {
        return {
          songInfo: this.musicPlayer.songInfo,
          stationName: this.musicPlayer.station?.name
        }
      },
      ({
        songInfo,
        stationName
      }: {
        songInfo: MusicPlayerStore['songInfo']
        stationName: string
      }) => {
        let artist = 'No Artist Data',
          song
        if (songInfo?.artist) {
          //set meta data
          artist = songInfo.artist
          song = songInfo.title
        }
        this.setMetaData({ artist, song, stationName })
      }
    )
    const actionHandlers = [
      [
        'play',
        () => {
          console.log('session play')
          this.musicPlayer.resume()
        }
      ],
      [
        'pause',
        () => {
          console.log('session pause')
          this.musicPlayer.pause()
        }
      ],
      [
        'stop',
        () => {
          console.log('session stop')
          this.musicPlayer.stop()
        }
      ]
    ]

    if (this.assertMediaSession(this.navigator.mediaSession)) {
      for (const [action, handler] of actionHandlers) {
        try {
          // @ts-expect-error - problem with setActionHandler overload
          this.navigator.mediaSession.setActionHandler(action, handler)
        } catch (error) {
          console.log(
            `The media session action "${action}" is not supported yet.`
          )
        }
      }
    }
  }

  setMetaData(data: {
    img?: string
    stationName?: string
    artist?: string
    song?: string
  }) {
    if (this.assertMediaSession(this.navigator.mediaSession)) {
      this.navigator.mediaSession.metadata = new MediaMetadata({
        title: data.song,
        artist: data.artist,
        album: data.stationName
      })
    }
  }

  protected assertMediaSession(item: any): item is MediaSession {
    return 'mediaSession' in this.navigator
  }
}
