import { AuthExpiredError } from 'lib/services/auth-service'
import { RootStore } from 'lib/stores/root-store'
import { action, makeObservable, observable } from 'mobx'

export type AppTheme = 'light' | 'dark'

export function appShellFactory(root: RootStore) {
  return new AppShellStore(root)
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

  constructor(protected rootStore: RootStore) {
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

  setUserIsSignedIn(isSignedIn: boolean) {
    this.userIsSignedIn = isSignedIn
  }
}
