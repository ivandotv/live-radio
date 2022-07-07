describe('Landing page', () => {
  it('shows login buttons', () => {
    cy.visit('/')

    cy.getBySel('login').contains(/sign in or register/i)

    cy.getBySel('anonymous')
      .contains(/anonymous user/i)
      .click()

    cy.location('pathname').should('match', /\/app$/)
  })
})
