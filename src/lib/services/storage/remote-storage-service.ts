import { RadioDTO } from 'lib/station-utils'
import { client } from 'lib/utils'
import { AppStorageService } from './app-storage-service'

export class RemoteStorage implements AppStorageService {
  constructor(protected transport: typeof client) {}

  async getFavoriteStations(): Promise<RadioDTO[]> {
    return await this.transport('/api/favorites', {
      method: 'GET'
    })
  }

  async addFavoriteStation(station: RadioDTO) {
    return await this.transport('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(station)
    })
  }

  async removeFavoriteStation(id: string) {
    return await this.transport(`/api/favorites?id=${id}`, {
      method: 'DELETE'
    })
  }

  async getRecentStations(): Promise<RadioDTO[]> {
    return await this.transport('/api/recent', {
      method: 'GET'
    })
  }

  async addRecentStation(station: RadioDTO) {
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
}
