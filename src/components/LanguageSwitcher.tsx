import { t } from '@lingui/macro'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { isDevelopment, isPreview } from 'browser-config'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { ChangeEvent } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrap: {
      '& fieldset': {
        opacity: 0
      }
    },
    root: {
      color: theme.palette.primary.contrastText
    },
    icon: {
      color: theme.palette.primary.contrastText
    }
  })
)

export function LanguageSwitcher({
  onChange
}: {
  onChange: (key: string) => void
}) {
  const languages: { [key: string]: string } = {
    en: t`English`,
    sr: t`Serbian`,
    help: t`Help Translate`
  }
  if (isPreview || isDevelopment) {
    languages.pseudo = t`Pseudo`
  }

  const locales = Object.keys(languages)

  const classes = useStyles()
  const router = useRouter()

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    const key = e.target.value as string

    onChange(key)

    if (key === 'help') {
      return
    }
    Cookies.set('NEXT_LOCALE', key, {
      expires: 31, //one month,
      path: '/',
      sameSite: 'lax'
    })
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      {
        locale: key
      }
    )
  }

  return (
    <div className={classes.wrap}>
      <Select
        variant="outlined"
        classes={{ root: classes.root, icon: classes.icon }}
        value={router.locale}
        onChange={handleChange}
      >
        {locales.map((locale) => {
          return (
            <MenuItem value={locale} key={locale}>
              {languages[locale]}
            </MenuItem>
          )
        })}
      </Select>
    </div>
  )
}
