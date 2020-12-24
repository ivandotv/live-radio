module.exports = {
  locales: ['en', 'sr', 'xx'],
  pseudoLocale: 'xx',
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
