import { action, makeObservable, observable } from 'mobx'
import { RootStore } from 'lib/stores/RootStore'

export type AppTheme = 'light' | 'dark'
export class AppShellStore {
  theme: AppTheme = 'light'

  persistTheme = false

  animateDesktopDrawer = false

  showApp = false

  desktopDrawerIsOpen = true

  desktopDrawerWidth = 270

  userIsSignedIn = false

  constructor(protected rootStore: RootStore) {
    makeObservable(this, {
      showApp: observable,
      theme: observable,
      desktopDrawerIsOpen: observable,
      userIsSignedIn: observable,
      readyToShow: action,
      setDesktopDrawer: action,
      setTheme: action
    })
  }

  setTheme(value: AppTheme, persist: boolean = true) {
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
