describe('Landing page', () => {
  it('shows login buttons', () => {
    console.log('base url ', Cypress.config('baseUrl'))
    cy.visit('/')

    cy.getBySel('login').contains(/sign in or register/i)

    cy.getBySel('anonymous')
      .contains(/anonymous user/i)
      .click()

    cy.location('pathname').should('match', /\/app$/)
  })
})
