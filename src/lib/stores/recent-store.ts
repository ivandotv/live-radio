import {
  ASYNC_STATUS,
  Collection,
  DeleteConfig,
  unwrapResult
} from '@fuerte/core'
import { createRadioModel, RadioModel } from 'lib/radio-model'
import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { RecentStationsTransport } from 'lib/services/storage/recent-stations-transport'
import { RadioDTO } from 'lib/station-utils'
import { RadioStore } from 'lib/stores/favorites-store'
import { RootStore } from 'lib/stores/root-store'
import { client } from 'lib/utils'

export function recentStoreFactory(_root: RootStore) {
  return new RecentStore(
    createRadioModel,
    new RecentStationsTransport(appStorageFactory(), client)
  )
}

export class RecentStore
  extends Collection<
    RadioModel,
    typeof createRadioModel,
    RecentStationsTransport
  >
  implements RadioStore
{
  protected result!: RadioModel[]

  async loadStations() {
    if (!this.result && this.loadStatus !== ASYNC_STATUS.PENDING) {
      this.result = unwrapResult(await super.load()).added
    }

    return this.result
  }

  get stations() {
    return this.models
  }

  saveStation(data: RadioDTO) {
    let model = this.getById(data._id)
    if (!model) {
      model = this.create(data)
    }

    this.unshift(model)
    this.save(model)
  }

  async deleteStation(id: string, config: DeleteConfig) {
    return await super.delete(id, config)
  }

  countStationClick(id: string): void {
    this.transport.countStationClick(id)
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    const model = this.getById(id)
    if (model) {
      return model.data
    }

    return await this.transport.getStationInfo(id)
  }
}
