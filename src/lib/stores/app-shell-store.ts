import { action, makeObservable, observable } from 'mobx'
import { RootStore } from 'lib/stores/root-store'

export type AppTheme = 'light' | 'dark'
export class AppShellStore {
  theme: AppTheme = 'light'

  persistTheme = false

  animateDesktopDrawer = false

  showApp = false

  desktopDrawerIsOpen = true

  userIsSignedIn = false

  showInstallPrompt = false

  beforeInstallPrompt: BeforeInstallPromptEvent | undefined

  constructor(protected rootStore: RootStore) {
    makeObservable<this, 'handleBeforePWAInstall' | 'handleAppInstalled'>(
      this,
      {
        showApp: observable,
        theme: observable,
        desktopDrawerIsOpen: observable,
        userIsSignedIn: observable,
        showInstallPrompt: observable,
        readyToShow: action,
        setDesktopDrawer: action,
        setTheme: action,
        hideInstallPrompt: action,
        handleBeforePWAInstall: action,
        handleAppInstalled: action
      }
    )

    if (typeof window !== 'undefined') {
      window.addEventListener(
        'beforeinstallprompt',
        this.handleBeforePWAInstall.bind(this)
      )
      window.addEventListener(
        'appinstalled',
        this.handleAppInstalled.bind(this)
      )
    }
  }

  protected handleBeforePWAInstall(e: Event) {
    e.preventDefault()
    // Stash the event so it can be triggered later.
    this.beforeInstallPrompt = e as BeforeInstallPromptEvent
    this.showInstallPrompt = true
  }

  protected handleAppInstalled() {
    this.hideInstallPrompt()
    // TODO - track in analytics
    console.log('app installed')
  }

  async installPWA() {
    if (!this.beforeInstallPrompt) {
      throw new Error('must wait for before install prompt event')
    }

    this.beforeInstallPrompt.prompt()
    const { outcome } = await this.beforeInstallPrompt.userChoice

    // TODO - track outcome in analytics
    console.log('user choice: ', outcome)

    this.beforeInstallPrompt = undefined
  }

  hideInstallPrompt() {
    this.showInstallPrompt = false
    this.beforeInstallPrompt = undefined
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
