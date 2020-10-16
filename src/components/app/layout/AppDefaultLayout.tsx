import { NextApplicationPage } from '../../../pages/_app'
import { AppShellProvider } from '../providers/AppShellProvider'
import { MainProvider } from '../providers/MusicPlayerProvider'
import { AppShellLayout } from './AppShellLayout'

export function AppDefaultLayout(Component: NextApplicationPage, props: any) {
  return (
    <AppShellProvider>
      <MainProvider>
        <AppShellLayout>
          <Component {...props} />
        </AppShellLayout>
      </MainProvider>
    </AppShellProvider>
  )
}
