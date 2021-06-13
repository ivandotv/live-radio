import globalStyles from 'styles/global'
import { Trans } from '@lingui/macro'
export default function GlobalErrorFallback() {
  return (
    <div className="page-wrap">
      <h1>
        <Trans>Oh My!</Trans>
      </h1>
      <p>
        <Trans>Live Radio ecountered an error. Please reload the page.</Trans>
      </p>
      <a className="app-btn" onClick={() => window.location.reload()}>
        <Trans>reload</Trans>
      </a>
      <style jsx global>
        {globalStyles}
      </style>
      <style jsx>
        {`
          .page-wrap {
            display: flex;
            flex-direction: column;
            height: 100vh;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  )
}
