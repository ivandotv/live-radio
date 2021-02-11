import Link from 'next/link'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { PageTitle } from 'components/PageTitle'
import { getSession, signIn, signOut, useSession } from 'next-auth/client'
<<<<<<< HEAD
import { url } from 'lib/appSettings'
=======
import { url, db } from 'app-confg'
>>>>>>> 12ef997 (enable auth)
import { Avatar } from '@material-ui/core'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { test } from 'app-confg'

export default function Index() {
  const [session] = useSession()
  const router = useRouter()
<<<<<<< HEAD
  const localePath = router.defaultLocale === router.locale ? '' : router.locale
=======
  const localePath =
    router.defaultLocale === router.locale ? '' : `/${router.locale}`
>>>>>>> 12ef997 (enable auth)

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
          <img width="450" height="326" src="/images/landing-page.svg" />
        </div>
        <div className="btn-wrap">
          <Link
            locale={session ? undefined : false}
            href={session ? '/app' : '/api/auth/signin'}
            passHref={true}
            prefetch={false}
          >
            <a
              onClick={(e: React.MouseEvent) => {
                if (!session) {
                  e.preventDefault()
                  signIn(undefined, {
<<<<<<< HEAD
                    callbackUrl: `${url}/${localePath}/app`
=======
                    callbackUrl: `${url}${localePath}/app`
>>>>>>> 12ef997 (enable auth)
                  })
                }
              }}
              className={clsx('app-btn', { 'has-session': session })}
            >
              {session ? t`Welcome Back` : t`Sign in or Register`}
              {session ? (
                <div className="avatar avatar-user">
<<<<<<< HEAD
                  <Avatar src={session?.user.image as string}></Avatar>
=======
                  <Avatar
                    alt={session?.user?.name ?? '?'}
                    src={session?.user.image as string}
                  ></Avatar>
>>>>>>> 12ef997 (enable auth)
                </div>
              ) : null}
            </a>
          </Link>
          <Link passHref={true} prefetch={false} href="/app">
            <a
              onClick={(e: React.MouseEvent) => {
                if (session) {
                  e.preventDefault()
<<<<<<< HEAD
                  signOut({ callbackUrl: `${url}/${localePath}/app` })
=======
                  signOut({ callbackUrl: `${url}${localePath}/app` })
>>>>>>> 12ef997 (enable auth)
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
          <span>test: {process.env.NEXT_PUBLIC_NEXTAUTH_URL}</span>
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
              text-align: center;
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
              background-color: blue;
              border-radius: 6px;
              color: #fff;
              padding: 8px;
              font-size: 0.9rem;
              text-decoration: none;
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
          {`
            body {
              font-family: 'Open Sans', sans-serif;
            }
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #212121;
                color: white;
              }
            }
          `}
        </style>
      </div>
    </>
  )
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: NextPageContext) {
<<<<<<< HEAD
=======
  console.log('test env ', process.env.LOCAL_TEST)
  console.log('DB test ', db)

>>>>>>> 12ef997 (enable auth)
  return {
    props: {
      session: await getSession(context)
    }
  }
}
