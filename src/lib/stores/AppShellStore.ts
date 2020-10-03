import { action, makeAutoObservable, makeObservable, observable } from 'mobx'

export type AppTheme = 'light' | 'dark'
export class AppShellStore {
  theme: AppTheme = 'light'

  showApp: boolean = true

  desktopDrawerIsOpen: boolean = true

  mobileDrawerIsOpen: boolean = false

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
      desktopDrawerIsOpen: observable
      //   readyToShow: action
    })
  }

  setTheme(value: AppTheme) {
    this.theme = value
  }

  readyToShow(show: boolean) {
    console.log('store.readyToShow ', show)
    this.showApp = show
  }

  setDesktopDrawer(isOpen: boolean) {
    this.desktopDrawerIsOpen = isOpen
  }

  setMobileDrawer(isOpen: boolean) {
    this.mobileDrawerIsOpen = isOpen
  }
}
