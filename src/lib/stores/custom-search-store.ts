import { action, makeObservable, observable, runInAction } from 'mobx'
import { RadioBrowserApi } from 'radio-browser-api'
import { RadioStation } from 'lib/station-utils'
import { dataToRadioStations } from 'lib/station-utils'
import { userAgentName } from 'app-config'

export class CustomSearchStore {
  query = ''

  lastQuery = ''

  protected api: RadioBrowserApi

  protected searchTimeoutId: number | undefined

  protected requestToken: number | undefined

  data: { result?: RadioStation[]; error?: Error } = {}

  searchInProgress = false

  constructor(transport: typeof fetch) {
    this.api = new RadioBrowserApi(transport, userAgentName)

    makeObservable<CustomSearchStore, 'searchData'>(this, {
      search: action,
      searchData: action,
      data: observable,
      searchInProgress: observable,
      query: observable
    })
  }

  search(query: string, delay?: number): void {
    this.query = query

    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId)
    }

    if (query.length) {
      if (delay) {
        // debounce the search itself
        this.searchTimeoutId = window.setTimeout(() => {
          runInAction(() => {
            this.searchData(this.query)
          })
        }, delay)
      } else {
        this.searchData(this.query)
      }
    }
  }

  protected async searchData(query: string) {
    // respond only to last resolved promise
    const localToken = Date.now()
    this.requestToken = localToken
    this.searchInProgress = true

    try {
      const result = await this.api.searchStations(
        {
          name: query,
          limit: 3000
        },
        undefined,
        true
      )
      if (this.requestToken === localToken) {
        // process stations
        runInAction(() => {
          this.data = { result: dataToRadioStations(result) }
          this.searchInProgress = false
          this.lastQuery = query
        })
      }
    } catch (error) {
      if (this.requestToken === localToken) {
        runInAction(() => {
          this.data = { error }
          this.searchInProgress = false
          this.lastQuery = query
        })
      }
    }
  }
}
