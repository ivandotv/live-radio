export class SongInfoService {
  protected timeoutId: number | undefined

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
        }, 1000)
      }
    } catch (err) {
      cb(err)
      this.stop()
    }
  }

  protected async fetchData(stationUrl: string) {
    const response = await this.transport('/api/songinfo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: stationUrl })
    })
    console.log('RRR')
    console.log(response)
    if (!response.ok) {
      throw new Error()
    }

    return await response.json()
  }

  stop() {
    this.stopped = true
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }
}
