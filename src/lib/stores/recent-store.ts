import {
  ASYNC_STATUS,
  Collection,
  DeleteConfig,
  SaveConfig,
  unwrapResult
} from '@fuerte/core'
import { createRadioModel, RadioModel } from 'lib/radio-model'
import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { RecentStationsTransport } from 'lib/services/storage/recent-stations-transport'
import { RadioDTO } from 'lib/station-utils'
import { RadioStore } from 'lib/stores/favorites-store'
import { RootStore } from 'lib/stores/root-store'
import { client } from 'lib/utils'

export function recentStoreFactory(root: RootStore) {
  return new RecentStore(
    root,
    new Collection(
      createRadioModel,
      new RecentStationsTransport(appStorageFactory(), client)
    )
  )
}

export class RecentStore implements RadioStore {
  protected result!: RadioModel[]

  constructor(
    protected root: RootStore,
    protected collection: Collection<
      RadioModel,
      typeof createRadioModel,
      RecentStationsTransport
    >
  ) {}

  async loadStations() {
    if (!this.result && this.collection.loadStatus !== ASYNC_STATUS.PENDING) {
      const result = await this.collection.load()

      this.root.appShell.checkAuthError(result.error)

      this.result = unwrapResult(result).added
    }

    return this.result
  }

  get loadStatus() {
    return this.collection.loadStatus
  }

  get stations() {
    return this.collection.models
  }

  async saveStation(data: RadioDTO, config?: SaveConfig) {
    let model = this.collection.getById(data._id)
    if (!model) {
      model = this.collection.create(data)
    }

    this.collection.unshift(model)
    const result = await this.collection.save(model, config)

    this.root.appShell.checkAuthError(result.error)

    return result
  }

  async deleteStation(id: string, config?: DeleteConfig) {
    const result = await this.collection.delete(id, config)

    this.root.appShell.checkAuthError(result.error)

    return result
  }

  countStationClick(id: string): void {
    this.collection.getTransport().countStationClick(id)
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    const model = this.collection.getById(id)
    if (model) {
      return model.data
    }

    return await this.collection.getTransport().getStationInfo(id)
  }
}
