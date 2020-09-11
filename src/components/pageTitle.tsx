import Head from 'next/head'

export function PageTitle({ title }: { title: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} key="title" />
    </Head>
  )
}
