import ISO6391 from 'iso-639-1'
import { useRouter } from 'next/router'
import { BrowseBy } from '../../../../components/app/BrowseBy'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { FilterStoreProvider } from '../../../../components/app/providers/StoreProvider'
import { AppMenuItem } from '../../../../components/app/sidebars/AppMenuItem'

const languages = ISO6391.getAllNames()

export default function LanguageList() {
  const router = useRouter()

  const languageSearch = languages.map((language) => {
    return {
      language
    }
  })

  const languageDataRow = function (languages: { language: string }[]) {
    return function LanguageRow(index: number) {
      const language = languages[index].language

      return (
        <AppMenuItem
          link={{
            href: {
              pathname: `${router.pathname}/[language]`
            },
            as: {
              pathname: `${router.pathname}/${language.replace(/\s/g, '-')}`
            }
          }}
          primary={`${language}`}
        />
      )
    }
  }

  const breadcrumbs = [
    {
      href: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-language',
      text: 'By Language'
    }
  ]

  return (
    <FilterStoreProvider
      initialState={languageSearch}
      uuid="language"
      indexes={['language']}
    >
      <BrowseBy
        filterInputText="Filter Languages"
        title="Browse For Stations by Language"
        breadcrumbs={breadcrumbs}
        dataRow={languageDataRow}
      ></BrowseBy>
    </FilterStoreProvider>
  )
}

LanguageList.layout = AppDefaultLayout
