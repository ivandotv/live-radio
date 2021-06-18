import { RadioStation } from 'lib/station-utils'
import { RadioStore } from './radio-store'

export class RecentStationsStore extends RadioStore {
  protected addStation(station: RadioStation): Promise<any> {
    return this.storage.addRecentStation(station)
  }

  protected resolveStations() {
    return this.storage.getRecentStations()
  }

  protected removeStation(id: string) {
    return this.storage.removeRecentStation(id)
  }
}
