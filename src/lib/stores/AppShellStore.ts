import { action, makeObservable, observable } from 'mobx'
import { RootStore } from 'lib/stores/RootStore'

export type AppTheme = 'light' | 'dark'
export class AppShellStore {
  theme: AppTheme = 'light'

  persistTheme = false

  animateDesktopDrawer = false

  showApp = false

  desktopDrawerIsOpen = true

  mobileDrawerIsOpen = false

  mobileDrawerWidth = 300

  desktopDrawerWidth = 270

  playerInFullScreen = false

  constructor(protected rootStore: RootStore) {
    makeObservable(this, {
      showApp: observable,
      theme: observable,
      desktopDrawerIsOpen: observable,
      playerInFullScreen: observable,
      readyToShow: action,
      setDesktopDrawer: action,
      setMobileDrawer: action,
      setTheme: action,
      setPlayerFullScreen: action
    })
  }

  setTheme(value: AppTheme, persist: boolean = true) {
    this.theme = value
    this.persistTheme = persist
  }

  readyToShow(show: boolean) {
    console.log('store.readyToShow ', show)
    this.showApp = show
  }

  setDesktopDrawer(isOpen: boolean, animate = true) {
    this.desktopDrawerIsOpen = isOpen
    this.animateDesktopDrawer = animate
  }

  setMobileDrawer(isOpen: boolean) {
    this.mobileDrawerIsOpen = isOpen
  }

  setPlayerFullScreen(isFullScreen: boolean) {
    this.playerInFullScreen = isFullScreen
  }
}
