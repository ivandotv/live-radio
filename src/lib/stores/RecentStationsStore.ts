import { AppStorage } from 'lib/LocalDB'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { RadioStation } from 'types'
import { RootStore } from './RootStore'

export class RecentStationsStore {
  protected stationsById: Map<string, RadioStation> = new Map()

  loading = false

  loaded = false

  constructor(protected rootStore: RootStore, protected storage: AppStorage) {
    makeObservable<RecentStationsStore, 'stationsById'>(this, {
      stationsById: observable.shallow,
      add: action,
      load: action,
      stations: computed,
      loading: observable,
      loaded: observable
    })
  }

  async load() {
    if (this.loaded) {
      return
    }

    this.loading = true
    const stations = await this.storage.getStationHistory()

    runInAction(() => {
      this.loading = false
      this.loaded = true
      console.log('storage stations loaded ', stations)

      stations.forEach((station) => {
        this.stationsById.set(station.id, station)
      })
    })
  }

  get stations() {
    return [...this.stationsById.values()].reverse()
  }

  get(id: string) {
    return this.stationsById.get(id)
  }

  add(station: RadioStation) {
    const favStation = this.stationsById.get(station.id)
    if (!favStation) {
      this.stationsById.set(station.id, station)
    }
    this.storage.addStationToFavorites(station)
  }
}
