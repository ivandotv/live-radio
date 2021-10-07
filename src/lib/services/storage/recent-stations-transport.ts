import { Transport } from '@fuerte/core'
import { RadioModel } from 'lib/radio-model'
import { RadioDTO } from 'lib/station-utils'
import type { client } from 'lib/utils'
import { AppStorage } from './app-storage-service'

export class RecentStationsTransport implements Transport<RadioModel> {
  constructor(
    protected storage: AppStorage,
    protected httpClient: typeof client
  ) {}

  async load(): Promise<{ data: any[] }> {
    const data = await this.storage.getRecentStations()

    return { data }
  }

  async save(radio: RadioModel): Promise<void> {
    await this.storage.addRecentStation(radio.data)
  }

  async delete(radio: RadioModel): Promise<void> {
    return await this.storage.removeRecentStation(radio.id)
  }

  async countStationClick(id: string): Promise<void> {
    return this.storage.countStationClick(id)
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    return this.storage.getStationInfo(id)
  }
}
