import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { I18nProvider } from '@lingui/react'
import { SHARED_CONFIG } from 'lib/shared/config'
import { GlobalErrorFallback } from 'components/GlobalErrorFallback'
import { PWAIcons } from 'components/PWAIcons'
import { WindowErrorHandler } from 'components/WindowErrorHandler'
import { globalErrorHandler, initTranslations } from 'lib/shared/utils'
import { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export type NextApplicationPage<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
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
  const browserFirstRender = useRef(true)

  if (browserFirstRender.current && pageProps.translation) {
    i18n.load(locale, pageProps.translation)
    i18n.activate(locale)
  }

  useEffect(() => {
    if (pageProps.translation && !browserFirstRender.current) {
      i18n.load(locale, pageProps.translation)
      i18n.activate(locale)
    }
    browserFirstRender.current = false
  }, [locale, pageProps.translation])

  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onError={globalErrorHandler}
    >
      <WindowErrorHandler />
      <SessionProvider
        refetchInterval={0} //60 * 60
        session={pageProps.session} //in case of server side rendered routes
      >
        <I18nProvider i18n={i18n}>
          <Head>
            <link
              rel="manifest"
              key="manifest"
              crossOrigin="use-credentials"
              href={'/api/manifest'}
            />
            <meta
              name="description"
              content={t`Listen live radio online`}
              key="description"
            />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="black-translucent"
            />
            <meta name="apple-mobile-web-app-title" content={t`Live Radio`} />
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
              key="viewport"
            />
            <meta name="robots" content="noindex" />
            <meta name="keywords" content="pwa,radio,live" />
            <meta charSet="utf-8" />
            <PWAIcons />
            {router.locales!.concat('x-default').map((locale) => {
              const localePath = locale === 'x-default' ? '' : `/${locale}`
              const href = `${SHARED_CONFIG.url}${localePath}${router.asPath}`

              return locale === 'pseudo' ? null : (
                <link
                  key={locale}
                  rel="alternate"
                  hrefLang={locale}
                  href={href}
                />
              )
            })}
          </Head>
          {Component.layout ? (
            Component.layout(Component, pageProps)
          ) : (
            <Component {...pageProps} />
          )}
        </I18nProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}
