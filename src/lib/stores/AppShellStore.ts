import { action, makeObservable, observable } from 'mobx'

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

  constructor() {
    // this.theme = 'light'
    // this.showApp = false
    // this.desktopDrawerIsOpen = true
    // this.mobileDrawerIsOpen = false
    // todo - videti da pomeri inicijalizaciju gore
    // makeAutoObservable(this)
    makeObservable(this, {
      showApp: observable,
      theme: observable,
      desktopDrawerIsOpen: observable,
      // persistTheme: observable,
      readyToShow: action,
      setDesktopDrawer: action,
      setMobileDrawer: action,
      setTheme: action
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
}
