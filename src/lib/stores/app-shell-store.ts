import { AuthExpiredError } from 'lib/services/auth-service'
import {
  appStorageFactory,
  AppStorageService
} from 'lib/services/storage/app-storage-service'
import { RootStore } from 'lib/stores/root-store'
import { action, makeObservable, observable } from 'mobx'

export type AppTheme = 'light' | 'dark'

export function appShellFactory(root: RootStore) {
  return new AppShellStore(root, appStorageFactory())
}

export class AppShellStore {
  theme: AppTheme = 'light'

  persistTheme = false

  animateDesktopDrawer = false

  showApp = false

  desktopDrawerIsOpen = true

  userIsSignedIn = false

  isOnLine = true

  authExpired = false

  constructor(
    protected rootStore: RootStore,
    protected storage: AppStorageService
  ) {
    makeObservable<this, 'setIsOnline'>(this, {
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
      checkAuthError: action,
      setAuthExpired: action
    })
  }

  protected setIsOnline(online: boolean) {
    this.isOnLine = online
  }

  checkAuthError(error: unknown) {
    if (error instanceof AuthExpiredError) {
      this.setAuthExpired(true)
    }
  }

  setAuthExpired(isExpired: boolean): void {
    this.authExpired = isExpired
  }

  setTheme(value: AppTheme, persist = true) {
    this.theme = value
    this.persistTheme = persist
  }

  readyToShow(show: boolean) {
    this.showApp = show
  }

  setDesktopDrawer(isOpen: boolean, animate = true) {
    this.desktopDrawerIsOpen = isOpen
    this.animateDesktopDrawer = animate
  }

  getLocalFavorites() {
    return this.storage.getFavoriteStations('local')
  }

  getLocalRecent() {
    return this.storage.getRecentStations('local')
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
        this.rootStore.favoriteStations.add(
          this.rootStore.favoriteStations.create(fav.station)
        )
      }

      for (const rec of recent) {
        this.rootStore.recentStations.add(
          this.rootStore.recentStations.create(rec.station)
        )
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
      this.storage.removeAllFavoriteStations('local'),
      this.storage.removeAllRecentStations('local')
    ])
  }

  async countStationClick(id: string): Promise<boolean> {
    return this.storage.countStationClick(id)
  }
}
