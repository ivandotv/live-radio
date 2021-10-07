module.exports = {
  locales: ['en', 'sr', 'pseudo'],
  pseudoLocale: 'pseudo',
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en'
  },
  catalogs: [
    {
      path: 'src/translations/locales/{locale}/messages',
      // include: ['src/pages', 'src/components', 'src/generated']
      include: ['src/']
    }
  ],
  format: 'po'
}
