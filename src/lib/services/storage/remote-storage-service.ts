import { RadioDTO } from 'lib/station-utils'
import { client } from 'lib/utils'
import { AppStorageService } from './app-storage-service'

export class AuthExpiredError extends Error {
  constructor() {
    super('Auth expired')
    this.name = 'AuthExpiredError'
  }
}

export class RemoteStorage implements AppStorageService {
  constructor(protected transport: typeof client) {
    this.checkAuthError = this.checkAuthError.bind(this)
  }

  protected checkAuthError(err: unknown) {
    if (err instanceof Response && err.status === 401) {
      throw new AuthExpiredError()
    }
    throw err
  }

  getFavoriteStations(): Promise<RadioDTO[]> {
    return this.transport('/api/favorites', {
      method: 'GET'
    }).catch(this.checkAuthError)
  }

  addFavoriteStation(station: RadioDTO) {
    return this.transport('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(station)
    }).catch(this.checkAuthError)
  }

  removeFavoriteStation(id: string) {
    return this.transport(`/api/favorites?id=${id}`, {
      method: 'DELETE'
    }).catch(this.checkAuthError)
  }

  getRecentStations(): Promise<RadioDTO[]> {
    return this.transport('/api/recent', {
      method: 'GET'
    }).catch(this.checkAuthError)
  }

  addRecentStation(station: RadioDTO) {
    return this.transport('/api/recent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(station)
    }).catch(this.checkAuthError)
  }

  removeRecentStation(id: string) {
    return this.transport(`/api/recent?id=${id}`, {
      method: 'DELETE'
    }).catch(this.checkAuthError)
  }
}
