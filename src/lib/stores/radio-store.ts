import {
  ASYNC_STATUS,
  Collection,
  DeleteConfig,
  SaveConfig,
  unwrapResult
} from '@fuerte/core'
import { createRadioModel, RadioModel } from 'lib/radio-model'
import {
  appStorageFactory,
  StorageCollection
} from 'lib/services/storage/app-storage-service'
import { StationTransport } from 'lib/services/storage/station-transport'
import { RootStore } from 'lib/stores/root-store'
import { RadioDTO } from 'lib/utils/station-utils'

export interface IRadioStore {
  saveStation(station: RadioDTO, config?: SaveConfig): Promise<any>
  deleteStation(id: string, config?: DeleteConfig): Promise<any>
  get stations(): readonly RadioModel[]
  get loadStatus(): keyof typeof ASYNC_STATUS
  loadStations(): Promise<RadioModel[]>
  getStationById(id: string): RadioModel | undefined
  removeStation(id: string): void
}

export function radioStoreFactory(
  root: RootStore,
  collection: StorageCollection
) {
  return new RadioStore(
    root,
    createRadioModel,
    new StationTransport(appStorageFactory(), collection)
  )
}

/* TODO - use composition instead of inheritance */
//TODO - change to radio store
export class RadioStore implements IRadioStore {
  protected result!: RadioModel[]

  protected collection: Collection<
    RadioModel,
    typeof createRadioModel,
    StationTransport
  >

  constructor(
    protected root: RootStore,
    factory: typeof createRadioModel,
    transport: StationTransport
  ) {
    // super(factory, transport)
    this.collection = new Collection(factory, transport)
  }

  get loadStatus(): 'PENDING' | 'RESOLVED' | 'REJECTED' | 'IDLE' {
    return this.collection.loadStatus
  }

  async loadStations() {
    if (!this.result && this.loadStatus !== ASYNC_STATUS.PENDING) {
      const result = await this.collection.load()

      this.root.appShell.setAuthError(result.error)

      this.result = unwrapResult(result).added
    }

    return this.result
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
    const result = await this.collection.save(model, config)

    this.root.appShell.setAuthError(result.error)

    return result
  }

  async deleteStation(id: string, config?: DeleteConfig) {
    const result = await this.collection.delete(id, config)

    this.root.appShell.setAuthError(result.error)

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
