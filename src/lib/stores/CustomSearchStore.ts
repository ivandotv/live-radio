import {
  action,
  IObservableArray,
  makeObservable,
  observable,
  runInAction
} from 'mobx'
import { RadioBrowserApi } from 'radio-browser-api'
import { RadioStation } from '../../types'
import { stationsToRadioStations } from '../stationUtils'

export class CustomSearchStore {
  query = ''

  lastQuery = ''

  protected api: RadioBrowserApi

  protected searchTimeoutId: number | undefined

  protected requestToken: number | undefined

  data: { result?: RadioStation[]; error?: Error } | undefined = undefined

  searchInProgress = false

  constructor(transport: typeof fetch) {
    console.log('CUSTOM SEARCH STORE CONSTRUCTOR')
    this.api = new RadioBrowserApi('radio-next', transport)
    makeObservable<CustomSearchStore, 'searchData'>(this, {
      search: action,
      searchData: action,
      data: observable,
      searchInProgress: observable,
      query: observable
    })
  }

  search(query: string, delay?: number): void {
    // debounce search
    this.query = query

    // debounce the search itself
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId)
    }

    if (query.length) {
      if (delay) {
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
    const localToken = Date.now()
    this.requestToken = localToken
    this.searchInProgress = true
    console.log('start search ', query)
    try {
      const result = await this.api.searchStations({
        name: query,
        limit: 3000
      })
      if (this.requestToken === localToken) {
        // process stations
        runInAction(() => {
          this.data = { result: stationsToRadioStations(result) }
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
