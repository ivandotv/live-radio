import { I18n } from '@lingui/core'
import { en, sr } from 'make-plural/plurals'
import { GetStaticProps } from 'next'
import defaultCatalog from 'translations/locales/en/messages'

export function initTranslations(i18n: I18n) {
  i18n.loadLocaleData({
    en: { plurals: en },
    sr: { plurals: sr },
    xx: { plurals: en } // english plurals for pseudo
  })

  i18n.load('en', defaultCatalog.messages)
  i18n.activate('en')
}

export const getStaticTranslations: GetStaticProps<
  { translation: any },
  { locale: string }
> = async function getStaticTranslations({ locale }) {
  const messages = await loadTranslation(locale!)

  return {
    props: {
      translation: messages
    }
  }
}

export async function loadTranslation(locale: string): Promise<any> {
  const { messages } = await import(
    `@lingui/loader!translations/locales/${locale}/messages.po`
  )

  return messages
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
