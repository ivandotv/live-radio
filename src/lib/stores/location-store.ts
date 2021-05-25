import { action, makeObservable, observable, runInAction } from 'mobx'

export class LocationStore {
  loading = false

  error = false

  data: { name: string; code: string; cont: string; flag: string } | undefined =
    undefined //mobx thing

  protected url = '/api/geolocation '

  constructor() {
    makeObservable(this, {
      data: observable,
      loading: observable,
      error: observable,
      getLocation: action
    })
  }

  async getLocation() {
    if (this.loading || this.data) return
    this.loading = true
    this.error = false

    try {
      const response = await fetch(this.url)
      if (response.ok) {
        const data = await response.json()
        runInAction(() => {
          this.data = data
        })
      } else {
        throw new Error()
      }
    } catch (e) {
      runInAction(() => {
        this.error = true
      })
    } finally {
      this.loading = false
    }
  }
}
