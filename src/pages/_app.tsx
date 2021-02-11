import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { I18nProvider } from '@lingui/react'
import { url } from 'app-config'
import { PWAIcons } from 'components/PWAIcons'
import { initTranslations } from 'initTranslations'
import { NextPage } from 'next'
import { Provider as AuthProvider } from 'next-auth/client'
<<<<<<< HEAD
=======
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useRef } from 'react'
>>>>>>> 5d607ef (fix mongodb atlas config)

export type NextApplicationPage<P = {}, IP = P> = NextPage<P, IP> & {
  desktopSidebar?: (
    defaultMenuItems: ReactElement | ReactElement[]
  ) => ReactElement
  layout?: (page: NextApplicationPage, props: any) => ReactElement
}

initTranslations(i18n)

export default function MyApp(props: AppProps) {
  const {
    Component,
    pageProps
  }: { Component: NextApplicationPage; pageProps: any } = props

  const router = useRouter()
  const locale = router.locale || router.defaultLocale!
  const firstRender = useRef(true)

  if (firstRender.current) {
    if (pageProps.translation) {
      i18n.load(locale, pageProps.translation)
      i18n.activate(locale)
    }
  }

  useEffect(() => {
    console.log('use effect ', locale)
    if (pageProps.translation && !firstRender.current) {
      console.log('load ', locale)
      i18n.load(locale, pageProps.translation)
      i18n.activate(locale)
    }
    firstRender.current = false
  }, [locale, pageProps.translation])

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
          key="viewport"
        />
        <meta name="robots" content="noindex" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="description"
          content={t`Listen live radio online`}
          key="description"
        />
        <meta name="keywords" content={t`pwa,radio,live`} key="keywords" />
        <PWAIcons />
        {router.locales!.concat('x-default').map((locale) => {
          const localePath = locale === 'x-default' ? '' : `/${locale}`
          const href = `${url}${localePath}${router.asPath}`

          return locale === 'xx' ? null : (
            <link key={locale} rel="alternate" hrefLang={locale} href={href} />
          )
        })}
      </Head>

      <I18nProvider i18n={i18n}>
        <AuthProvider
          options={{
            clientMaxAge: 0 //60 * 60
          }}
          session={pageProps.session}
        >
          {Component.layout ? (
            Component.layout(Component, pageProps)
          ) : (
            <Component {...pageProps} />
          )}
        </AuthProvider>
      </I18nProvider>
    </>
  )
}
