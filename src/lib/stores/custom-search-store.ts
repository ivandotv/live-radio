import { action, makeObservable, observable, runInAction } from 'mobx'
import { RadioBrowserApi } from 'radio-browser-api'
import { RadioStation } from 'lib/station-utils'
import { dataToRadioStations } from 'lib/station-utils'
import { userAgentName } from 'browser-config'

let store: CustomSearchStore

export function customSearchFactory() {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new CustomSearchStore()

  // For SSG and SSR always create a new store
  if (isSSR) return _store

  // Create the store once in the client
  return (store = _store)
}

export class CustomSearchStore {
  query = ''

  lastQuery = ''

  protected api: RadioBrowserApi

  protected searchTimeoutId: number | undefined

  protected requestToken: Record<string, unknown> | undefined

  data: { result?: RadioStation[]; error?: Error } = {}

  searchInProgress = false

  constructor() {
    this.api = new RadioBrowserApi(userAgentName)

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
    const localToken = {}
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
