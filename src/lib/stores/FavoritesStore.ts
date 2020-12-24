import { AppStorage } from 'lib/LocalDB'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { RadioStation } from 'types'
import { RootStore } from './RootStore'

export class FavoritesStore {
  // stations: RadioStation[] = []
  // stations: Map<string, RadioStation> = new Map()

  protected stationsById: Map<string, RadioStation> = new Map()

  // stations: number[] = []

  loading = false

  loaded = false

  constructor(protected rootStore: RootStore, protected storage: AppStorage) {
    makeObservable<FavoritesStore, 'stationsById'>(this, {
      // stations: observable.shallow,
      stationsById: observable.shallow,
      add: action,
      remove: action,
      load: action,
      stations: computed,
      loading: observable,
      loaded: observable
    })
  }

  async load() {
    this.loading = true
    if (this.loaded) {
      this.loading = false

      return
    }

    const stations = await this.storage.getfavoriteStations()

    setTimeout(() => {
      runInAction(() => {
        this.loading = false
        this.loaded = true
        console.log('storage stations loaded ', stations)

        stations.forEach((station) => {
          // console.log('push station ', station.id)
          this.stationsById.set(station.id, station)
        })

        console.log([...this.stationsById.values()])
      })
    }, 200)

    // setTimeout(() => {
    //   runInAction(() => {
    //     this.loading = false
    //     this.loaded = true
    //     this.stationsById.set(1, 1)
    //     this.stationsById.set(2, 2)
    //     this.stationsById.set(3, 3)
    //     this.stationsById.set(4, 4)
    //   })
    //   console.log('set timeout')
    // }, 4000)
  }

  get stations() {
    return [...this.stationsById.values()]
  }

  get(id: string) {
    return this.stationsById.get(id)
  }

  add(station: RadioStation) {
    const favStation = this.stationsById.get(station.id)
    if (!favStation) {
      this.stationsById.set(station.id, station)
      // transport save
    }
    this.storage.addStationTofavorites(station)
  }

  remove(id: string) {
    const favStation = this.stationsById.get(id)

    if (favStation) {
      this.stationsById.delete(id)
      // transport save
    }
    this.storage.removeStationFromfavorites(id)
  }
}
