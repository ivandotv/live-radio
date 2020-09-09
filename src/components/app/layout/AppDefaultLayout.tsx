import { NextApplicationPage } from '../../../pages/_app'
import { AppShellProvider } from '../AppShellProvider'
import { AppShellLayout } from './AppShellLayout'

export function AppDefaultLayout(Component: NextApplicationPage, props: any) {
  return (
    <AppShellProvider>
      <AppShellLayout>
        <Component {...props} />
      </AppShellLayout>
    </AppShellProvider>
  )
}
