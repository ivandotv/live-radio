import { AppMenuItem } from 'components/navigation/desktop/MenuItem'
import { useRouter } from 'next/router'

export function CountryDataRow({
  data
}: {
  data: { name: string; code: string; flag: string; cont: string }
}) {
  const router = useRouter()

  return (
    <AppMenuItem
      link={{
        prefetch: false,
        href: {
          pathname: `${router.pathname}/[country]`.toLowerCase()
        },
        as: {
          pathname: `${router.pathname.replace('[continent]', data.cont)}/${
            data.code
          }`.toLowerCase()
        }
      }}
      primary={`${data.name} ${data.flag}`}
    />
  )
}
