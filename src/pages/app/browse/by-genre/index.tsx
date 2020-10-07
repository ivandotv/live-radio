import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import { useRouter } from 'next/router'
import { LocationBreadCrumbs } from '../../../../components/app/LocationBreadCrumbs'
import { PageTitle } from '../../../../components/PageTitle'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { AppMenuItem } from '../../../../components/app/sidebars/AppMenuItem'
import { FilterList } from '../../../../components/app/FilterList'
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
                .replace(/\s/g, '-')}`
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
      {/* <List>{genreList}</List> */}
      <FilterList store={store} itemRow={listRow}></FilterList>
    </Paper>
  )
}

GenreList.layout = AppDefaultLayout
