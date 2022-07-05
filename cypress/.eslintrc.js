module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'cypress/globals': true
  },
  plugins: ['cypress'],
  extends: ['../.eslintrc.js', 'plugin:cypress/recommended']
}
