/**
 *  NOTE: injection tokens needs a separate file from the injection-root
 *  because of the circular dependecies between tokens and root store
 *
 */

export const injectionTokens = {
  recentRadioStore: Symbol('RecentRadioStore'),
  favoritesRadioStore: Symbol('FavoritesRadioStore')
}
