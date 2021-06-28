import * as JsSearch from 'js-search'
import { action, makeObservable, observable, runInAction } from 'mobx'

export function filterDataFactory(
  initialState: any[],
  uuid: string,
  indexes: string[],
  query?: string
) {
  //filter store can't be a singleton
  const store = new FilterDataStore()

  if (initialState) {
    store.hydrate(initialState, uuid, indexes, query)
  }

  return store
}

export class FilterDataStore {
  allData: any[] = []

  filtered: any[] = []

  query: string = ''

  protected searchApi: JsSearch.Search | undefined

  protected searchTimeoutId: number | undefined

  constructor() {
    console.log('filter store constructor')
    makeObservable(this, {
      allData: observable.shallow,
      filtered: observable.shallow,
      query: observable,
      hydrate: action,
      search: action
    })
  }

  hydrate(data: any[], uuid: string, indexes: string[], query?: string): void {
    // ;(this.allData as IObservableArray).replace([...data])
    // ;(this.filtered as IObservableArray).replace(this.allData)
    this.allData = [...data]
    this.filtered = [...data]

    this.searchApi = new JsSearch.Search(uuid)
    indexes.forEach((index) => {
      this.searchApi!.addIndex(index)
    })
    this.searchApi.addDocuments(this.allData)

    if (query) {
      console.log('---------  QUERY AGAIN ', query)
      this.search(query)
    }
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
          this.searchData(this.query)
        })
      }, delay)
    } else {
      this.searchData(this.query)
    }
  }

  protected searchData(query: string): void {
    if (this.query.length === 0) {
      // ;(this.filtered as IObservableArray).replace([...this.allData])
      this.filtered = [...this.allData]
    } else {
      const result = this.searchApi?.search(query) as []
      // ;(this.filtered as IObservableArray).replace([...result])
      this.filtered = [...result]
    }
  }

  addData(data: any[]) {
    // ;(this.allData as IObservableArray).replace([...data])
    this.allData.push(data)
    this.searchApi!.addDocuments(data)
  }
}
