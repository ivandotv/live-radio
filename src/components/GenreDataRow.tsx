import { useRouter } from 'next/router'
import { AppMenuItem } from 'components/navigation/desktop/MenuItem'

export function GenreDataRow({
  data
}: {
  data: { genre: string; raw: string }
}) {
  const router = useRouter()

  return (
    <AppMenuItem
      link={{
        prefetch: false,
        href: {
          pathname: `${router.pathname}/[genre]`
        },
        as: {
          pathname: `${router.pathname}/${data.raw.replace(/\s/g, '-')}`
        }
      }}
      primary={`${data.genre}`}
    />
  )
}
