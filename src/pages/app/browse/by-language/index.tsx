import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import { useRouter } from 'next/router'
import { LocationBreadCrumbs } from '../../../../components/app/LocationBreadCrumbs'
import { PageTitle } from '../../../../components/PageTitle'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { AppMenuItem } from '../../../../components/app/sidebars/AppMenuItem'
import ISO6391 from 'iso-639-1'

const languages = ISO6391.getAllNames()

export default function LanguageList() {
  const router = useRouter()

  const languageList = []

  console.log('pathname ', router.pathname)

  for (const language of languages) {
    languageList.push(
      <li key={language}>
        <AppMenuItem
          link={{
            href: {
              pathname: `${router.pathname}/[language]`
            },
            as: {
              pathname: `${router.pathname}/${language
                // .toLowerCase()
                .replace(/\s/g, '-')}`
            }
          }}
          primary={`${language}`}
        />
      </li>
    )
  }

  const breadcrumbLinks = [
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
    <Paper>
      <PageTitle title="Browse For Stations by Language" />
      <LocationBreadCrumbs links={breadcrumbLinks} />
      <List>{languageList}</List>
    </Paper>
  )
}

LanguageList.layout = AppDefaultLayout
