import { useRootStore } from 'components/providers/RootStoreProvider'
import { observer } from 'mobx-react-lite'
import PwaNotification from './PwaNotification'
import { t } from '@lingui/macro'

const InstallBanner = observer(function InstallBanner() {
  const { appShell } = useRootStore()

  return (
    <PwaNotification
      onCancel={() => appShell.hideInstallPrompt(false)}
      onOk={appShell.installPWA.bind(appShell)}
      show={appShell.showInstallPrompt}
      title={t`Install`}
      okText={t`Install`}
    >
      <p>
        {t`Installing Live Radio uses almost no storage and provides a quick way to
        launch it from the home screen.`}
      </p>
    </PwaNotification>
  )
})

export default InstallBanner
