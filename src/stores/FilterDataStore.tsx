import * as JsSearch from 'js-search'
import {
  action,
  IObservableArray,
  isObservable,
  makeObservable,
  observable
} from 'mobx'
// import { useStaticRendering } from 'mobx-react-lite'
import { RadioStation } from '../components/app/ListStations'

export class FilterDataStore {
  allStations: RadioStation[] = []

  stations: RadioStation[] = []

  query: string = ''

  protected searchApi: JsSearch.Search | undefined

  protected delay: number | undefined

  constructor() {
    makeObservable(this, {
      stations: observable.shallow,
      allStations: observable.shallow,
      query: observable,
      hydrate: action,
      search: action
    })
  }

  hydrate(stations: RadioStation[], delay = 200): void {
    ;(this.allStations as IObservableArray).replace([...stations])
    ;(this.stations as IObservableArray).replace(this.allStations)
    this.searchApi = new JsSearch.Search('uuid')
    this.searchApi.addIndex('tags')
    this.searchApi.addIndex('name')
    this.searchApi.addDocuments(this.allStations)
    this.delay = delay
  }

  search(query: string, delay = false): void {
    // debounce search
    this.query = query
    if (this.query.length === 0) {
      this.stations.replace([...this.allStations])
    } else {
      const result = this.searchApi?.search(query) as []
      this.stations.replace([...result])
    }
  }
}
