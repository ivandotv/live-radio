import Link from 'next/link'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { PageTitle } from 'components/PageTitle'

export default function Index() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div className="page-wrap">
        <PageTitle title={t`Welcome to Live Radio App`} />
        <h1>Live Radio</h1>
        <div className="banner-wrapper">
          <img src="/images/speed-sound-note.svg" />
        </div>
        <div className="btn-wrap">
          <Link href="/app">
            <a className="app-btn">{t`Login or Register`}</a>
          </Link>
          <Link href="/app">
            <a className="app-btn">{t`Anonymous User`}</a>
          </Link>
        </div>
        <style jsx>
          {`
            .page-wrap {
              display: flex;
              flex-flow: column;
              align-items: center;
            }
            h1 {
              font-size: 4rem;
              margin-top: 8px;
              margin-bottom: 16px;
            }
            .banner-wrapper {
              width: 100%;
              max-width: 500px;
              display: flex;
              justify-content: center;
            }
            .banner-wrapper img {
              width: 90%;
              height: auto;
              margin-bottom: 24px;
            }
            .btn-wrap {
              margin-top: 24px;
            }
            .app-btn {
              background-color: blue;
              border-radius: 6px;
              color: #fff;
              padding: 16px;
              font-size: 0.9rem;
              text-decoration: none;
            }
            .app-btn:last-child {
              margin-left: 8px;
            }
          `}
        </style>
        <style jsx global>
          {`
            body {
              font-family: 'Open Sans', sans-serif;
            }
          `}
        </style>
      </div>
    </>
  )
}
