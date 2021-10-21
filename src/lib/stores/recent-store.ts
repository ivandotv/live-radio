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

export function recentStoreFactory(root: RootStore) {
  return new RecentStore(
    root,
    createRadioModel,
    new RecentStationsTransport(appStorageFactory())
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

  constructor(
    protected root: RootStore,
    factory: typeof createRadioModel,
    transport: RecentStationsTransport
  ) {
    super(factory, transport)
  }

  async loadStations() {
    if (!this.result && this.loadStatus !== ASYNC_STATUS.PENDING) {
      const result = await this.load()

      this.root.appShell.checkAuthError(result.error)

      this.result = unwrapResult(result).added
    }

    return this.result
  }

  async saveStations(stations: RadioDTO[], config?: SaveConfig) {
    for (const station of stations) {
      await this.saveStation(station, config)
    }
  }

  get stations() {
    return this.models
  }

  async saveStation(data: RadioDTO, config?: SaveConfig) {
    let model = this.getById(data._id)
    if (!model) {
      model = this.create(data)
    }

    this.unshift(model)
    const result = await this.save(model, config)

    this.root.appShell.checkAuthError(result.error)

    return result
  }

  async deleteStation(id: string, config?: DeleteConfig) {
    const result = await this.delete(id, config)

    this.root.appShell.checkAuthError(result.error)

    return result
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    const model = this.getById(id)
    if (model) {
      return model.data
    }

    return await this.getTransport().getStationInfo(id)
  }
}
