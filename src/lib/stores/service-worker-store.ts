import type { Workbox } from 'workbox-window'
import { RootStore } from './root-store'
export class ServiceWorkerStore {
  protected wb!: Workbox

  constructor(protected root: RootStore) {}

  register(wb: Workbox) {
    this.wb = wb
    wb.addEventListener('waiting', this.showSkipWaitingPrompt.bind(this))

    wb.addEventListener('waiting', (evt: WorkboxLifecycleWaitingEvent) => {})
    this.wb.register()
  }

  protected showSkipWaitingPrompt(_evt: Event) {}
}
