import { I18n } from '@lingui/core'
import { en, sr } from 'make-plural/plurals'
import { GetStaticProps } from 'next'
import { isProduction } from 'server-config'

export function initTranslations(i18n: I18n) {
  i18n.loadLocaleData({
    en: { plurals: en },
    sr: { plurals: sr },
    pseudo: { plurals: en } // english plurals for pseudo
  })
}

export const getStaticTranslations: GetStaticProps<
  { translation: any },
  { locale: string }
> = async function getStaticTranslations({ locale }) {
  const messages = await loadTranslations(locale!)

  return {
    props: {
      translation: messages
    }
  }
}

export async function loadTranslations(locale: string) {
  let data
  if (isProduction) {
    data = await import(`../../translations/locales/${locale}/messages`)
  } else {
    data = await import(
      `@lingui/loader!../../translations/locales/${locale}/messages.po`
    )
  }

  return data.messages
}

export function paramsWithLocales<T = any>(
  props: T[],
  locales: string[]
): {
  params: T
  locale: string
}[] {
  return props.flatMap((prop) => {
    return locales.map((locale) => {
      return {
        params: prop,
        locale
      }
    })
  })
}
