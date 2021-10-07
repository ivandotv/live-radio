import PwaNotification from 'components/pwa-prompt/PwaNotification'
import { t } from '@lingui/macro'
export function InstallBanner({
  onCancel,
  onOk,
  show
}: {
  onCancel: () => void
  onOk: () => void
  show: boolean
}) {
  return (
    <PwaNotification
      onCancel={onCancel}
      onOk={onOk}
      show={show}
      title={t`Install`}
      okText={t`Install`}
    >
      <p>
        {t`Installing Live Radio uses almost no storage and provides a quick way to
        launch it from the home screen.`}
      </p>
    </PwaNotification>
  )
}
