import { AppStorage } from 'lib/services/storage/app-storage-service'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { RadioStation } from 'lib/station-utils'
import { RootStore } from './root-store'

export type TransactionStatus<TData = any> = {
  status: 'pending' | 'resolved' | 'rejected' | null
  result: TData
}

export type Sync<T = any> = {
  status: 'pending' | 'resolved' | 'rejected'
  data: T
}

export abstract class RadioStore {
  protected stationsById: Map<string, RadioStation> = new Map()

  loadStatus: 'resolved' | 'rejected' | 'pending' | 'idle' = 'idle'

  loadError: unknown = null

  syncs = {
    add: new Map<string, Sync<boolean>>(),
    remove: new Map()
  }

  protected abstract resolveStations(): Promise<RadioStation[]>

  constructor(protected rootStore: RootStore, protected storage: AppStorage) {
    makeObservable<RadioStore, 'stationsById'>(this, {
      stationsById: observable.shallow,
      add: action,
      remove: action,
      removeLocal: action,
      load: action,
      stations: computed,
      loadError: observable,
      loadStatus: observable,
      syncs: observable
    })
  }

  //todo - mozda podeliti u vise metoda kada se bude pravio modul

  async load(force = false) {
    // create ticket is a promise

    if (!force && this.loadStatus === 'pending') return

    this.loadStatus = 'pending'
    this.loadError = null

    try {
      const stations = await this.resolveStations()
      runInAction(() => {
        stations.forEach((station) => {
          this.stationsById.set(station.id, station)
        })
        this.loadStatus = 'resolved'
      })
    } catch (e) {
      console.log('catch UT3!')
      runInAction(() => {
        this.loadStatus = 'rejected'
        this.loadError = e
      })
    }
  }

  get stations() {
    return [...this.stationsById.values()].reverse()
  }

  async add(station: RadioStation, optimistic = false) {
    const favStation = this.stationsById.get(station.id)
    if (favStation) return

    if (optimistic) {
      this.stationsById.set(station.id, station)
    }

    this.syncs.add.set(station.id, { status: 'pending', data: true })
    try {
      const data = await this.storage.addFavoriteStation(station)

      runInAction(() => {
        this.syncs.add.set(station.id, { status: 'resolved', data })
        if (!optimistic) {
          this.stationsById.set(station.id, station)
        }
      })

      return data
    } catch (e) {
      runInAction(() => {
        this.syncs.add.set(station.id, { status: 'rejected', data: e })
      })
      if (optimistic) {
        // remove the item from the collection
        runInAction(() => {
          this.stationsById.delete(station.id)
        })
      }
      throw e
    }
  }

  removeLocal(id: string) {
    console.log('remove local')
    this.syncs.remove.delete(id)

    return this.stationsById.delete(id)
  }

  async remove(id: string, optimistic = false) {
    const favStation = this.stationsById.get(id)
    if (!favStation) return

    if (optimistic) {
      this.stationsById.delete(id)
    }
    this.syncs.remove.set(id, { status: 'pending' })
    try {
      const data = await this.storage.removeFavoriteStation(id)
      runInAction(() => {
        this.syncs.remove.set(id, { status: 'resolved', data })
      })
    } catch (e) {
      runInAction(() => {
        this.syncs.remove.set(id, { status: 'rejected', data: e })
      })
      if (optimistic) {
        // put the item back in the collection
        runInAction(() => {
          this.stationsById.set(id, favStation)
        })
      }
      throw e
    }
  }
}
