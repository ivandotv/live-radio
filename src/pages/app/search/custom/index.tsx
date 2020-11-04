import { CustomSearchResults } from 'components/CustomSearchResults'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { CustomSearchProvider } from 'components/providers/CustomSearchProvider'
import { PageTitle } from 'components/PageTitle'
import { stationDataRow } from 'lib/stationUtils'

export default function CustomSearch() {
  const breadcrumbs = [
    {
      href: '/app/search',
      text: 'Search'
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
