import {
  ASYNC_STATUS,
  Collection,
  DeleteConfig,
  SaveConfig,
  unwrapResult
} from '@fuerte/core'
import { RadioModel, radioModelFactory } from 'lib/client/radio-model'
import { StationTransport } from 'lib/client/services/station-transport'
import { RadioDTO } from 'lib/shared/utils'
import { get } from 'pumpit'
import { StorageCollectionName } from '../services/storage/storage-service'
import { AppShellStore } from './app-shell-store'

export class RadioStore {
  protected result!: RadioModel[]

  collectionName!: StorageCollectionName

  static inject = [get(AppShellStore, { lazy: true }), Collection]

  constructor(
    protected appShell: AppShellStore,
    protected collection: Collection<
      RadioModel,
      typeof radioModelFactory,
      StationTransport
    >
  ) {}

  get loadStatus(): 'PENDING' | 'RESOLVED' | 'REJECTED' | 'IDLE' {
    return this.collection.loadStatus
  }

  async loadStations() {
    if (!this.result && this.loadStatus !== ASYNC_STATUS.PENDING) {
      const result = await this.collection.load(undefined, {
        collection: this.collectionName
      })

      this.appShell.setError(result.error)

      this.result = unwrapResult(result).added
    }

    return this.result
  }

  setCollectionNanme(name: StorageCollectionName) {
    this.collectionName = name
  }

  addStation(station: RadioDTO) {
    this.collection.add(this.collection.create(station))
  }

  async saveStation(station: RadioDTO, config?: SaveConfig) {
    let model = this.collection.getById(station._id)
    if (!model) {
      model = this.collection.create(station)
    }
    this.collection.unshift(model)
    const result = await this.collection.save(model, config, {
      collection: this.collectionName
    })

    this.appShell.setError(result.error)

    return result
  }

  async deleteStation(id: string, config?: DeleteConfig) {
    const result = await this.collection.delete(id, config, {
      collection: this.collectionName
    })

    this.appShell.setError(result.error)

    return result
  }

  removeStation(id: string) {
    this.collection.remove(id)
  }

  get stations() {
    return this.collection.models
  }

  getStationById(id: string) {
    return this.collection.getById(id)
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    const model = this.collection.getById(id)
    if (model) {
      return model.data
    }

    return await this.collection.getTransport().getStationInfo(id)
  }
}
