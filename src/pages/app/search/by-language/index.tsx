import ISO6391 from 'iso-639-1'
import { useRouter } from 'next/router'
import { BrowseBy } from 'components/BrowseBy'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { PageTitle } from 'components/PageTitle'

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
      href: '/app/search',
      text: 'Search'
    },
    {
      href: '/app/search/by-language',
      text: 'By Language'
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={languageSearch}
      uuid="language"
      indexes={['language']}
    >
      <PageTitle title="Search For Stations by Language" />
      <BrowseBy
        filterInputText="Filter Languages"
        breadcrumbs={breadcrumbs}
        dataRow={languageDataRow}
      ></BrowseBy>
    </FilterDataStoreProvider>
  )
}

LanguageList.layout = AppDefaultLayout
