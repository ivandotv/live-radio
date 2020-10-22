import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { CustomSearchResults } from '../../../../components/app/CustomSearchResults'
import { CustomSearchProvider } from '../../../../components/app/providers/CustomSearchProvider'
import { PageTitle } from '../../../../components/PageTitle'
import { stationDataRow } from '../../../../lib/stationUtils'

// todo -refactor styles to be merged with BrowseBy component
// const useStyles = makeStyles((theme: Theme) => {
//   return createStyles({
//     paper: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: 'calc( 100vh - 182px )' // todo calculate the value dinamically
//     },
//     noData: {
//       margin: theme.spacing(2)
//     },
//     listSkeleton: {
//       marginTop: theme.spacing(2),
//       marginBottom: theme.spacing(1),
//       marginLeft: theme.spacing(2),
//       marginRight: theme.spacing(2),
//       flex: 1
//     }
//   })
// })

export default function CustomSearch() {
  const breadcrumbs = [
    {
      href: '/app/browse',
      text: 'Browse'
    },
    {
      text: 'Custom Search'
    }
  ]

  return (
    <CustomSearchProvider>
      <PageTitle title="Custom search" />
      <CustomSearchResults
        filterInputText="Search For Stations"
        breadcrumbs={breadcrumbs}
        dataRow={stationDataRow(true, true, false)}
      />
    </CustomSearchProvider>
  )
}

CustomSearch.layout = AppDefaultLayout
