import { RadioModel } from 'lib/client/radio-model'
import { stationDataToStationModel } from 'lib/client/utils/misc-utils'
import { dataToRadioDTO } from 'lib/shared/utils'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { RadioBrowserApi } from 'radio-browser-api'

export class CustomSearchStore {
  query = ''

  lastQuery = ''

  data: { result?: RadioModel[]; error?: Error } = {}

  searchInProgress = false

  protected searchTimeoutId?: number

  protected requestToken?: Record<string, unknown>

  constructor(protected api: RadioBrowserApi) {
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
          this.data = {
            //TODO - optimize double iteration
            result: stationDataToStationModel(dataToRadioDTO(result))
          }
          this.searchInProgress = false
          this.lastQuery = query
        })
      }
    } catch (error: any) {
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
