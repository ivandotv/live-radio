import { RadioStation } from 'lib/station-utils'
import { client, ClientRequest } from 'lib/utils'
import { AppStorageService } from './app-storage-service'

export class RemoteStorage implements AppStorageService {
  constructor(protected transport: typeof client) {}

  async getFavoriteStations(): Promise<RadioStation[]> {
    return await this.runRequest('/api/favorites', {
      method: 'GET'
    })
  }

  async addFavoriteStation(station: RadioStation) {
    return await this.runRequest('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(station)
    })
  }

  async removeFavoriteStation(id: string) {
    return await this.runRequest(`/api/favorites`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
  }

  async getRecentStations(): Promise<RadioStation[]> {
    return await this.runRequest('/api/recent', {
      method: 'GET'
    })
  }

  async addRecentStation(station: RadioStation) {
    return await this.runRequest('/api/recent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(station)
    })
  }

  async removeRecentStation(id: string) {
    return await this.runRequest(`/api/recent?id=${id}`, {
      method: 'DELETE'
    })
  }

  async getLastPlayedStation() {
    const station = await this.runRequest<RadioStation[]>(
      '/api/recent?count=1',
      {
        method: 'GET'
      }
    )

    return station.length ? station[0] : null
  }

  protected async runRequest<T>(
    endpoint: string,
    config?: ClientRequest
  ): Promise<T> {
    const [data] = await this.transport<T>(endpoint, config)

    return data
  }
}
