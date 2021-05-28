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

export default function Index() {
  const [session] = useSession()
  const router = useRouter()

  const callback = useClientUrl(`/${router.locale}/app`)

  return (
    <>
      <div className="page-wrap">
        <PageTitle title={t`Welcome to Live Radio App`} />
        <h1>{t`Live Radio`}</h1>
        <div className="banner-wrapper">
          <img width="450" height="326" src="/images/landing-page.svg" />
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
