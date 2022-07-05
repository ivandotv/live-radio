describe('Geolocation error', () => {
  beforeEach(() => {
    cy.visit('/app')
    cy.waitShellVisible()
  })

  beforeEach(() => {
    cy.intercept('api/geolocation', {
      statusCode: 303,
      body: { error: 'Service unavailable' },
      delay: 500
    }).as('geolocation')
  })

  it('shows progress modal', () => {
    cy.getBySel('local-radio').click()

    cy.getBySel('location-modal').as('modal')

    cy.get('@modal')
      .should('be.visible')
      .should('contain.text', 'Determining your location')

    cy.get('[role=progressbar]').as('progressbar')

    cy.get('@progressbar').should('be.visible')

    cy.wait('@geolocation')

    cy.get('@progressbar').should('not.exist')
  })

  it('shows failed modal', () => {
    cy.getBySel('local-radio').click()

    cy.getBySel('location-modal').as('modal')

    cy.wait('@geolocation')

    cy.get('@modal').contains(/Sorry, couldn't get your location/i)

    cy.get('@modal').find('button').contains(/close/i).as('close_btn')

    cy.get('@modal')
      .find('button')
      .contains(/choose the location/i)
      .as('choose_btn')

    cy.get('@close_btn').should('be.visible')
    cy.get('@choose_btn').should('be.visible')
  })

  it('removes failed modal', () => {
    cy.getBySel('local-radio').click()

    cy.getBySel('location-modal').as('modal')

    cy.wait('@geolocation')

    cy.get('@modal').find('button').contains(/close/i).as('close_btn')

    cy.get('@close_btn').click()

    cy.get('@modal').should('not.exist')
  })

  it('goes to manual location', () => {
    cy.getBySel('local-radio').click()

    cy.getBySel('location-modal').as('modal')

    cy.wait('@geolocation')

    cy.get('@modal')
      .find('button')
      .contains(/choose the location/i)
      .click()

    cy.location('pathname').should('match', /\/app\/by-location$/)
  })
})
