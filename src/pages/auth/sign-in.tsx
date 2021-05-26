import { t } from '@lingui/macro'
import { PageTitle } from 'components/PageTitle'
import { useClientUrl } from 'lib/utils'
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import globalStyles from 'styles/global'

export default function SignIn({
  providers
}: {
  providers: Record<string, ClientSafeProvider>
}) {
  const router = useRouter()

  const queryCallback = router.query?.callbackUrl as string
  const callbackUrl = useClientUrl(`/${router.locale}/app`)

  return (
    <div className="page-wrap">
      <PageTitle title={t`Sign in`} />
      <div className="banner-wrapper">
        <img width="450" height="326" src="/images/landing-page.svg" />
      </div>
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
            Sign in with {provider.name}
          </a>
        ))}
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
            width: 150px;
            margin-top: -50px;
            margin-left: 35px;
          }
        `}
      </style>
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: { providers }
  }
}
