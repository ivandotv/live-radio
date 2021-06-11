import { RadioStation } from 'lib/station-utils'
import { client } from 'lib/utils'
import { AppStorageService } from './app-storage-service'

export class RemoteStorage implements AppStorageService {
  constructor(protected transport: typeof client) {}

  async getFavoriteStations(): Promise<RadioStation[]> {
    return await this.transport('/api/favorites', {
      method: 'GET'
    })
  }

  async addFavoriteStation(station: RadioStation) {
    return await this.transport('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(station)
    })
  }

  async removeFavoriteStation(id: string) {
    return await this.transport(`/api/favorites`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
  }

  async getRecentStations(): Promise<RadioStation[]> {
    return await this.transport('/api/recent', {
      method: 'GET'
    })
  }

  async addRecentStation(station: RadioStation) {
    console.log('add recent station')

    return await this.transport('/api/recent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(station)
    })
  }

  async removeRecentStation(id: string) {
    return await this.transport(`/api/recent?id=${id}`, {
      method: 'DELETE'
    })
  }

  async getLastPlayedStation() {
    const station = await this.transport<RadioStation[]>('/api/last-played')

    return station.length ? station[0] : null
  }
}
