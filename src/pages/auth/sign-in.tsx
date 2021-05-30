import { t } from '@lingui/macro'
import Link from 'next/link'
import { PageTitle } from 'components/PageTitle'
import { useClientUrl } from 'lib/utils'
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import globalStyles from 'styles/global'
import { loadTranslation } from 'lib/translations'
import { NextPageContext } from 'next'

export default function SignIn({
  providers
}: {
  providers: Record<string, ClientSafeProvider>
}) {
  const errors = {
    Signin: t`Try signing with a different account.`,
    OAuthSignin: t`Try signing with a different account.`,
    OAuthCallback: t`Try signing with a different account.`,
    OAuthCreateAccount: t`Try signing with a different account.`,
    EmailCreateAccount: t`Try signing with a different account.`,
    Callback: t`Try signing with a different account.`,
    OAuthAccountNotLinked: t`To confirm your identity, sign in with the same account you used originally.`,
    EmailSignin: t`Check your email address.`,
    CredentialsSignin: t`Sign in failed. Check the details you provided are correct.`,
    default: t`Unable to sign in.`
  } as const

  const router = useRouter()

  const errorType = router.query?.error as keyof typeof errors | undefined
  let errorMessage

  if (errorType) {
    errorMessage = errorType && (errors[errorType] ?? errors.default)
  }
  console.log('type ', errorType)
  console.log('msg ', errorMessage)

  const queryCallback = router.query?.callbackUrl as string
  const callbackUrl = useClientUrl(`/${router.locale}/app`)

  return (
    <div className="page-wrap">
      <PageTitle title={t`Sign in`} />
      <div className="banner-wrapper">
        <img width="450" height="326" src="/images/landing-page.png" />
      </div>
      {errorMessage ? (
        <div className="btn-wrap">
          <span className="error">{errorMessage}</span>
        </div>
      ) : null}
      <div className="btn-wrap">
        {Object.values(providers).map((provider) => (
          <a
            key={provider.name}
            className="app-btn"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: queryCallback || callbackUrl
              })
            }
          >
            <img
              className="login-icon"
              src={`/images/${provider.name.toLowerCase()}-login.png`}
            ></img>
            {t`Sign in with`} {provider.name}
          </a>
        ))}

        {errorMessage ? (
          <Link href="/app" passHref={true}>
            <a className="app-btn">{t`Anonymous User`}</a>
          </Link>
        ) : null}
      </div>
      <style jsx>
        {`
          .page-wrap {
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .btn-wrap {
            display: flex;
            flex-direction: column;
          }
          .banner-wrapper {
            width: 180px;
            margin-top: -50px;
            margin-left: 35px;
          }
          .error {
            background-color: #f00;
            color: #fff;
            padding: 8px;
            border-radius: 6px;
          }
          .app-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .login-icon {
            max-width: 20px;
            margin-right: 8px;
          }
        `}
      </style>
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  )
}

export async function getServerSideProps(
  ctx: NextPageContext & { locale: string }
) {
  const providers = await getProviders()
  const translation = await loadTranslation(ctx.locale!)

  return {
    props: { providers, translation }
  }
}
