import { injectionTokens } from 'lib/client/injection-tokens'
import { AuthExpiredError } from 'lib/client/services/auth-service'
import { AppStorageService } from 'lib/client/services/storage/app-storage-service'
import { action, makeObservable, observable } from 'mobx'
import { RadioStore } from './radio-store'

export type AppTheme = 'light' | 'dark'

export class AppShellStore {
  theme: AppTheme = 'light'

  persistTheme = false

  animateDesktopDrawer = false

  showApp = false

  desktopDrawerIsOpen = true

  userIsSignedIn = false

  isOnLine = true

  authExpired = false

  static inject = [
    injectionTokens.favoritesRadioStore,
    injectionTokens.recentRadioStore,
    AppStorageService
  ]

  constructor(
    protected favoriteStations: RadioStore,
    protected recentStations: RadioStore,
    protected storage: AppStorageService
  ) {
    makeObservable(this, {
      showApp: observable,
      theme: observable,
      desktopDrawerIsOpen: observable,
      userIsSignedIn: observable,
      authExpired: observable,
      isOnLine: observable,
      readyToShow: action,
      setDesktopDrawer: action,
      setTheme: action,
      setIsOnline: action,
      setAuthError: action
    })
  }

  setIsOnline(online: boolean) {
    this.isOnLine = online
  }

  //maybe set auth error
  setAuthError(error: unknown) {
    if (error instanceof AuthExpiredError) {
      this.authExpired = true

      return true
    }

    return false
  }

  setTheme(value: AppTheme, persist = true) {
    this.theme = value
    this.persistTheme = persist
  }

  readyToShow(ready: boolean) {
    this.showApp = ready
  }

  setDesktopDrawer(isOpen: boolean, animate = true) {
    this.desktopDrawerIsOpen = isOpen
    this.animateDesktopDrawer = animate
  }

  protected getLocalFavorites() {
    return this.storage.getAllStations('favorites', 'local')
  }

  protected getLocalRecent() {
    return this.storage.getAllStations('recent', 'local')
  }

  async transferAnonymousData(
    useFavs: boolean,
    useRecent: boolean,
    deleteAnonymous: boolean
  ) {
    //TODO create bulk add -> sort -> new load collection insert
    try {
      const { favorites, recent } = await this.storage.transferAnonymousData(
        useFavs,
        useRecent,
        deleteAnonymous
      )
      for (const fav of favorites) {
        this.favoriteStations.addStation(fav.station)
      }

      for (const rec of recent) {
        this.recentStations.addStation(rec.station)
      }

      if (deleteAnonymous) {
        await this.deleteAnonymousData()
      }

      return {
        error: undefined
      }
    } catch (err: any) {
      return {
        error: err.mgs ? err.msg : err.toString()
      }
    }
  }

  async hasAnonymousData() {
    try {
      const [favResult, recentResult] = await Promise.all([
        this.getLocalFavorites(),
        this.getLocalRecent()
      ])

      if (favResult.length || recentResult.length) {
        return true
      }

      return false
    } catch (e) {
      //just return false for any error
      return false
    }
  }

  async deleteAnonymousData() {
    return Promise.all([
      this.storage.removeAllStations('recent', 'local'),
      this.storage.removeAllStations('favorites', 'local')
    ])
  }

  async countStationClick(id: string): Promise<boolean> {
    return this.storage.countStationClick(id)
  }
}
