import { t } from '@lingui/macro'
import { Avatar } from '@material-ui/core'
import clsx from 'clsx'
import { PageTitle } from 'components/PageTitle'
import { loadTranslation } from 'lib/translations'
import { useClientUrl } from 'lib/utils'
import { NextPageContext } from 'next'
import { getSession, signOut, useSession } from 'next-auth/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import globalStyles from 'styles/global'
import Head from 'next/head'

export default function Index() {
  const [session] = useSession()
  const router = useRouter()

  const callback = useClientUrl(`/${router.locale}/app`)

  return (
    <>
      <Head>
        <link
          key="font-rancho"
          rel="stylesheet"
          as="font"
          href="https://fonts.googleapis.com/css?family=Rancho&display=swap"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="page-wrap">
        <PageTitle title={t`Welcome to Live Radio App`} />
        <h1 className="home-title">{t`Live Radio`}</h1>
        <div className="banner-wrapper">
          <img width="450" height="326" src="/images/landing-page.png" />
        </div>
        <div className="btn-wrap">
          <Link
            href={session ? '/app' : `/auth/sign-in?callbackUrl=${callback}`}
            passHref={true}
            prefetch={false}
          >
            <a className={clsx('app-btn', { 'has-session': session })}>
              {session ? t`Welcome Back` : t`Sign in or Register`}
              {session ? (
                <div className="avatar avatar-user">
                  <Avatar
                    alt={session?.user?.name ?? '?'}
                    src={session?.user.image as string}
                  ></Avatar>
                </div>
              ) : null}
            </a>
          </Link>
          <Link passHref={true} prefetch={false} href="/app">
            <a
              onClick={(e: React.MouseEvent) => {
                if (session) {
                  e.preventDefault()
                  signOut({
                    callbackUrl: `${window.location.origin.replace(
                      /\/$/,
                      ''
                    )}/app`
                  })
                }
              }}
              className="app-btn"
            >
              {t`Anonymous User`}
              <div className="avatar avatar-anonymous">
                <Avatar></Avatar>
              </div>
            </a>
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
              font-size: 6rem;
              margin-top: 8px;
              margin-bottom: 16px;
              text-align: center;
              font-family: Rancho, system-ui;
              text-shadow: 0px 1px 0px #ffffff, 0px 2px 0px #3869b3,
                0px 3px 0px #215358, 0px 4px 0px #8a8c8e, 0px 5px 0px #77787b,
                0px 6px 0px #636466, 0px 7px 0px #4d4d4f, 0px 8px 7px #001135;
              color: #215158;
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
              display: flex;
            }
            .app-btn {
              display: flex;
              align-items: center;
            }

            .avatar-user {
              margin-left: 8px;
            }

            .avatar-anonymous {
              visibility: hidden;
              width: 0;
            }
            .app-btn:last-child {
              margin-left: 8px;
            }
          `}
        </style>
        <style jsx global>
          {globalStyles}
        </style>
      </div>
    </>
  )
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(
  ctx: NextPageContext & { locale: string }
) {
  const session = await getSession(ctx)
  const translation = await loadTranslation(ctx.locale!)

  return {
    props: {
      session,
      translation
    }
  }
}
