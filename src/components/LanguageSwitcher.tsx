import { t } from '@lingui/macro'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
// import { lingui } from 'initTranslations'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import { ChangeEvent } from 'react'
import { isPreview } from 'browser-config'
import Cookies from 'js-cookie'

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

export function LanguageSwitcher() {
  const languages: { [key: string]: string } = {
    en: t`English`,
    sr: t`Serbian`
  }
  if (isPreview) {
    languages.xx = t`Pseudo`
  }

  const locales = Object.keys(languages)

  const classes = useStyles()
  const router = useRouter()

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    Cookies.set('NEXT_LOCALE', e.target.value as string, {
      expires: 31, //one month,
      path: '/'
    })
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      {
        locale: e.target.value as string
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
