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

  constructor(protected rootStore: RootStore) {
    makeObservable<this>(this, {
      showApp: observable,
      theme: observable,
      desktopDrawerIsOpen: observable,
      userIsSignedIn: observable,
      isOnLine: observable,
      readyToShow: action,
      setDesktopDrawer: action,
      setTheme: action,
      setIsOnline: action
    })
  }

  protected setIsOnline(online: boolean) {
    this.isOnLine = online
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
