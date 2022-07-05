describe('App home', () => {
  beforeEach(() => {
    cy.visit('/app')
    cy.waitShellVisible()
  })

  it('shows main navigation buttons', () => {
    cy.getBySel('local-radio').should('be.visible')
    cy.getBySel('by-genre').should('be.visible')
    cy.getBySel('by-location').should('be.visible')
    cy.getBySel('by-language').should('be.visible')
    cy.getBySel('custom-search').should('be.visible')
  })
})
