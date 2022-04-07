import { logger } from 'lib/logger-browser'
import { isSSR } from 'lib/utils/misc-utils'

const songLogger = logger.child({ label: 'song-ingo' })

export function songInfoServiceFactory() {
  return new SongInfoService(isSSR() ? fetch : fetch.bind(window))
}
export class SongInfoService {
  protected timeoutId: number | undefined

  protected static FETCH_TIMEOUT = 20000

  protected stopped = true

  constructor(protected transport: typeof fetch) {}

  async start(
    stationUrl: string,
    cb: (error: Error | null, data?: { artist: string; title: string }) => void
  ) {
    this.stopped = false
    try {
      const data = await this.fetchData(stationUrl)
      if (!this.stopped) {
        cb(null, data)
        this.timeoutId = window.setTimeout(() => {
          this.start(stationUrl, cb)
        }, SongInfoService.FETCH_TIMEOUT)
      }
    } catch (err: any) {
      cb(err)
      this.stop()
    }
  }

  protected async fetchData(stationUrl: string) {
    const response = await this.transport('/api/song-info', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: stationUrl })
    })
    if (!response.ok) {
      throw new Error()
    }

    return await response.json()
  }

  stop() {
    this.stopped = true

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = undefined

      songLogger.log('song service stopped')
    }
  }
}
