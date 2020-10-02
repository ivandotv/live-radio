import * as JsSearch from 'js-search'
import {
  action,
  IObservableArray,
  makeObservable,
  observable,
  runInAction
} from 'mobx'
import { RadioStation } from '../../components/app/ListStations'

export class FilterDataStore {
  allStations: RadioStation[] = []

  stations: RadioStation[] = []

  query: string = ''

  protected searchApi: JsSearch.Search | undefined

  protected searchTimeoutId: number | undefined

  constructor() {
    makeObservable(this, {
      stations: observable.shallow,
      allStations: observable.shallow,
      query: observable,
      hydrate: action,
      search: action
    })
  }

  hydrate(stations: RadioStation[]): void {
    ;(this.allStations as IObservableArray).replace([...stations])
    ;(this.stations as IObservableArray).replace(this.allStations)
    this.searchApi = new JsSearch.Search('uuid')
    this.searchApi.addIndex('tags')
    this.searchApi.addIndex('name')
    this.searchApi.addDocuments(this.allStations)
    // this.delay = delay
  }

  search(query: string, delay?: number): void {
    // debounce search
    this.query = query

    // debounce the search itself
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId)
    }

    if (delay && query.length) {
      this.searchTimeoutId = window.setTimeout(() => {
        runInAction(() => {
          this.searchStations(this.query)
        })
      }, delay)
    } else {
      this.searchStations(this.query)
    }
  }

  protected searchStations(query: string): void {
    if (this.query.length === 0) {
      ;(this.stations as IObservableArray).replace([...this.allStations])
    } else {
      const result = this.searchApi?.search(query) as []
      ;(this.stations as IObservableArray).replace([...result])
    }
  }
}
