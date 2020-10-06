import { NextApplicationPage } from '../../../pages/_app'
import { AppShellProvider } from '../providers/AppShellProvider'
import { MusicPlayerProvider } from '../providers/MusicPlayerProvider'
import { AppShellLayout } from './AppShellLayout'

export function AppDefaultLayout(Component: NextApplicationPage, props: any) {
  return (
    <AppShellProvider>
      <MusicPlayerProvider>
        <AppShellLayout>
          <Component {...props} />
        </AppShellLayout>
      </MusicPlayerProvider>
    </AppShellProvider>
  )
}
