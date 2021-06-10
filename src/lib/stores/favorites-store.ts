import { RadioStation } from 'lib/station-utils'
import { client } from 'lib/utils'
import { RadioStore } from './radio-store'

export class FavoriteStationsStore extends RadioStore {
  async add(station: RadioStation, optimistic = false) {
    await super.add(station, optimistic)
    try {
      await client('/api/vote-for-station', { data: { id: station.id } })
    } catch (e) {
      //TODO -log error
    }
  }

  protected resolveStations() {
    return this.storage.getFavoriteStations()
  }

  protected removeStation(id: string) {
    return this.storage.removeFavoriteStation(id)
  }
}
