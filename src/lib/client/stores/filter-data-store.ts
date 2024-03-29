import * as JsSearch from 'js-search'
import { action, makeObservable, observable, runInAction } from 'mobx'

export class FilterDataStore {
  allData: any[] = []

  filtered: any[] = []

  query = ''

  protected searchApi?: JsSearch.Search

  protected searchTimeoutId?: number

  constructor() {
    makeObservable(this, {
      allData: observable.shallow,
      filtered: observable.shallow,
      query: observable,
      hydrate: action,
      search: action
    })
  }

  hydrate<T>(
    data: readonly T[],
    uuid: string,
    indexes: string[],
    query?: string
  ): void {
    this.allData = [...data]
    this.filtered = [...data]

    this.searchApi = new JsSearch.Search(uuid)
    indexes.forEach((index) => {
      this.searchApi!.addIndex(index.split('.'))
    })
    this.searchApi.addDocuments(this.allData)

    if (query) {
      this.search(query)
    }
  }

  search(query: string, delay?: number): void {
    this.query = query

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
      this.filtered = [...this.allData]
    } else {
      const result = this.searchApi?.search(query) as []
      this.filtered = [...result]
    }
  }

  addData(data: any[]) {
    this.allData.push(data)
    this.searchApi!.addDocuments(data)
  }
}
