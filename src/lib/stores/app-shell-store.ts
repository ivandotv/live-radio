import { enablePWAInstallBanner } from 'browser-config'
import { RootStore } from 'lib/stores/root-store'
import { action, makeObservable, observable } from 'mobx'
import Cookies from 'js-cookie'

export type AppTheme = 'light' | 'dark'

const pwaInstallDismissedCookie = 'pwa_install_dismissed'

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
      console.log(
        'before install cookie ',
        Cookies.get(pwaInstallDismissedCookie)
      )
      if (!Cookies.get(pwaInstallDismissedCookie)) {
        this.showInstallPrompt = true
      }
    }
  }

  protected handleAppInstalled() {
    this.hideInstallPrompt(true)
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
    this.hideInstallPrompt(outcome === 'accepted' ? true : false)
    this.beforeInstallPrompt = undefined
  }

  hideInstallPrompt(accepted: boolean) {
    this.showInstallPrompt = false
    this.beforeInstallPrompt = undefined
    if (!accepted) {
      Cookies.set(pwaInstallDismissedCookie, '1', { expires: 1 })
    } else {
      Cookies.remove(pwaInstallDismissedCookie)
    }
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
