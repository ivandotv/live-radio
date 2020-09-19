import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import { useRouter } from 'next/router'
import { LocationBreadCrumbs } from '../../../../components/app/locationBreadCrumbs'
import { PageTitle } from '../../../../components/pageTitle'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { AppMenuItem } from '../../../../components/app/sidebars/AppMenuItem'
import { genres } from '../../../../lib/popularGenres'

export default function GenreList() {
  const router = useRouter()

  const genreList = []

  console.log('pathname ', router.pathname)

  for (const genre of genres) {
    genreList.push(
      <li key={genre}>
        <AppMenuItem
          link={{
            href: {
              pathname: `${router.pathname}/[genre]`
            },
            as: {
              pathname: `${router.pathname}/${genre
                // .toLowerCase()
                .replace(' ', '-')}`
            }
          }}
          primary={`${genre}`}
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
      href: '/app/browse/by-genre',
      text: 'By Genre'
    }
  ]

  return (
    <Paper>
      <PageTitle title="Browse For Stations by Genre" />
      <LocationBreadCrumbs links={breadcrumbLinks} />
      <List>{genreList}</List>
    </Paper>
  )
}

GenreList.layout = AppDefaultLayout
