import { action, makeObservable, observable } from 'mobx'
import type { Workbox } from 'workbox-window'

// follow
// https://github.com/GoogleChrome/workbox/issues/2786
// https://github.com/GoogleChrome/workbox/issues/2850
export class ServiceWorkerStore {
  wb!: Workbox

  showUpdatePrompt: boolean = false

  constructor() {
    this.update = this.update.bind(this)
    this.hideUpdatePrompt = this.hideUpdatePrompt.bind(this)

    makeObservable<this, 'onWaiting' | 'onControlling'>(this, {
      showUpdatePrompt: observable,
      onWaiting: action,
      onControlling: action,
      hideUpdatePrompt: action
    })
  }

  register(wb: Workbox) {
    this.wb = wb
    wb.addEventListener('waiting', this.onWaiting.bind(this))

    this.wb.register()
    console.log('register worker')
  }

  protected onWaiting(_evt: any) {
    this.showUpdatePrompt = true
  }

  protected onControlling(_evt: any) {
    window.location.reload()
  }

  // called on user click
  update() {
    this.wb.addEventListener('controlling', this.onControlling.bind(this))

    this.wb.messageSkipWaiting()
    this.hideUpdatePrompt()
  }

  hideUpdatePrompt() {
    this.showUpdatePrompt = false
  }
}
