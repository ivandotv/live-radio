import { RadioStation } from 'types'
import { StorageProvider } from './AppStorage'

export class RemoteStorage implements StorageProvider {
  constructor(protected fetchImpl: typeof fetch) {}

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

  protected async runRequest<TResult = any>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<TResult> {
    const response = await this.fetchImpl(input, init)
    if (response.ok) {
      return await response.json()
    }
    throw response
  }
}
