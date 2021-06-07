import { ServerStyleSheets } from '@material-ui/core/styles'
import Document, {
  DocumentContext,
  Html,
  Main,
  NextScript,
  Head
} from 'next/document'
import React from 'react'
import csso from 'csso'

export default class MyDocument extends Document {
  render() {
    console.log('_document render')

    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.com" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
            key="viewport"
          />
          <meta name="robots" content="noindex" />
          <meta name="keywords" content="pwa,radio,live" />
          <meta charSet="utf-8" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
    })

  const initialProps = await Document.getInitialProps(ctx)

  const styleElement = sheets.getStyleElement()
  /* server rendered material ui is NOT minified
    use csso to minify generated css
  */
  styleElement.props.dangerouslySetInnerHTML.__html = csso.minify(
    styleElement.props.dangerouslySetInnerHTML.__html
  ).css

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), styleElement]
  }
}
