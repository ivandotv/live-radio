import { t } from '@lingui/macro'
import { Avatar } from '@material-ui/core'
import clsx from 'clsx'
import { PageTitle } from 'components/PageTitle'
import { importTranslations } from 'lib/server/utils'
import { useClientUrl } from 'lib/client/hooks'
import { NextPageContext } from 'next'
import { getSession, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import globalStyles from 'lib/client/global-styles'
import { getServerContainer } from 'lib/server/injection-root'

export default function Index() {
  const { data: session } = useSession()

  console.log('session data ', session)

  const router = useRouter()

  const callback = useClientUrl(`/${router.locale}/app`)

  return (
    <>
      <div className="page-wrap">
        <PageTitle title={t`Welcome to Live Radio App`} />
        <div className="logo-wrapper">
          <Image
            alt={t`application name`}
            width="400"
            height="140"
            objectFit="contain"
            src="/images/app-name.png"
          />
        </div>
        <div className="banner-wrapper">
          <Image
            alt={t`landing page image`}
            width="450"
            height="326"
            priority={true}
            src="/images/landing-page.png"
          />
        </div>
        <div className="btn-wrap">
          <Link
            href={session ? '/app' : `/auth/sign-in?callbackUrl=${callback}`}
            passHref={true}
            prefetch={false}
          >
            <a
              data-test="login"
              className={clsx('app-btn', { 'has-session': session })}
            >
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
              data-test="anonymous"
              title={t`All data will be stored locally in your browser.`}
              onClick={(e: React.MouseEvent) => {
                if (session) {
                  e.preventDefault()
                  //no need to wait ,callback will navigate away
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
              user-select: none;
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
  // const session = await getSession(ctx)
  const session = await getServerContainer().resolve<typeof getSession>(
    getSession
  )()
  const translation = await importTranslations(ctx.locale!)

  return {
    props: {
      session,
      translation
    }
  }
}
