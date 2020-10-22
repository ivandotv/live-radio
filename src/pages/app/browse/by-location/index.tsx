import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { LocationBreadcrumbs } from '../../../../components/app/LocationBreadcrumbs'
import { AppMenuItem } from '../../../../components/app/sidebars/AppMenuItem'
import { PageTitle } from '../../../../components/PageTitle'
import { continentsByCode } from '../../../../lib/utils/continentsByode'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

const useStyles = makeStyles((_theme: Theme) => {
  return createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc( 100vh - 182px )'
    }
  })
})
export default function ByLocation() {
  const continents = []
  const classes = useStyles()

  for (const [key, value] of Object.entries(continentsByCode)) {
    continents.push(
      <li key={key}>
        <AppMenuItem
          link={{
            href: {
              pathname: '/app/browse/by-location/[continent]'
            },
            as: {
              pathname: `/app/browse/by-location/${key}`
            }
          }}
          primary={value}
        />
      </li>
    )
  }

  const breadcrumbs = [
    {
      href: '/app/browse',
      as: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-location',
      as: '/app/browse/by-location',
      text: 'By Location'
    }
  ]

  return (
    <>
      <PageTitle title="Browse By Location" />
      <LocationBreadcrumbs links={breadcrumbs} />
      <List>{continents}</List>
    </>
  )
}

ByLocation.layout = AppDefaultLayout
