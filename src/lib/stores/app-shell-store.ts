import { enablePWAInstallBanner } from 'browser-config'
import { RootStore } from 'lib/stores/root-store'
import { action, makeObservable, observable } from 'mobx'

export type AppTheme = 'light' | 'dark'

let store: AppShellStore

export function appShellFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new AppShellStore(root)

  if (isSSR) return _store

  return (store = _store)
}

export class AppShellStore {
  theme: AppTheme = 'light'

  persistTheme = false

  animateDesktopDrawer = false

  showApp = false

  desktopDrawerIsOpen = true

  userIsSignedIn = false

  showInstallPrompt = false

  beforeInstallPrompt: BeforeInstallPromptEvent | undefined

  userChoice: 'dismissed' | 'accepted' | undefined = undefined

  isOnLine = true

  constructor(protected rootStore: RootStore) {
    makeObservable<
      this,
      'handleBeforePWAInstall' | 'handleAppInstalled' | 'setIsOnline'
    >(this, {
      showApp: observable,
      theme: observable,
      desktopDrawerIsOpen: observable,
      userIsSignedIn: observable,
      showInstallPrompt: observable,
      userChoice: observable,
      isOnLine: observable,
      readyToShow: action,
      setDesktopDrawer: action,
      setTheme: action,
      setIsOnline: action,
      hideInstallPrompt: action,
      handleBeforePWAInstall: action,
      handleAppInstalled: action
    })

    if (typeof window !== 'undefined') {
      window.addEventListener(
        'beforeinstallprompt',
        this.handleBeforePWAInstall.bind(this)
      )
      window.addEventListener(
        'appinstalled',
        this.handleAppInstalled.bind(this)
      )

      if ('onLine' in window.navigator) {
        console.log('setup online')
        this.setIsOnline(window.navigator.onLine)

        window.addEventListener('offline', (_e: Event) => {
          this.setIsOnline(false)
        })
        window.addEventListener('online', (_e: Event) => {
          this.setIsOnline(true)
        })
      }
    }
  }

  protected setIsOnline(online: boolean) {
    this.isOnLine = online
  }

  protected handleBeforePWAInstall(e: Event) {
    e.preventDefault()
    console.log('before install prompt')
    console.log(e)
    // Stash the event so it can be triggered later.
    this.beforeInstallPrompt = e as BeforeInstallPromptEvent
    //guard: sometimes this event fires when user clicks "cancel" in chrome ui (linux)
    if (enablePWAInstallBanner && !this.userChoice) {
      this.showInstallPrompt = true
    }
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

    this.userChoice = outcome

    // TODO - track outcome in analytics
    console.log('user choice: ', outcome)
    this.hideInstallPrompt()
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
