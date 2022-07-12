const countryCode = {
  code: 'RS',
  cont: 'EU',
  flag: '🇷🇸',
  name: 'Serbia'
}
describe('Geolocation success', () => {
  beforeEach(() => {
    cy.visit('/app')
    cy.waitShellVisible()
  })

  beforeEach(() => {
    cy.intercept('api/geolocation', {
      statusCode: 200,
      body: countryCode,
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

  it('shows success modal', () => {
    cy.getBySel('local-radio').click()

    cy.getBySel('location-modal').as('modal')

    cy.wait('@geolocation')

    cy.get('@modal').contains(/Your location is/i)

    cy.get('@modal')
      .find('button')
      .contains(/different location/i)
      .should('be.visible')

    cy.get('@modal')
      .find('button')
      .contains(/let's go/i)
      .should('be.visible')

    cy.get('@modal').contains(countryCode.flag).should('be.visible')
    cy.get('@modal').contains(countryCode.name).should('be.visible')
  })

  it('goes to manual location', () => {
    cy.getBySel('local-radio').click()

    cy.getBySel('location-modal').as('modal')

    cy.wait('@geolocation')

    cy.get('@modal')
      .find('button')
      .contains(/choose different location/i)
      .click()

    cy.location('pathname').should('match', /\/app\/by-location$/)
  })

  it('goes to found country ip', () => {
    cy.getBySel('local-radio').click()

    cy.getBySel('location-modal').as('modal')

    cy.wait('@geolocation')

    cy.get('@modal')
      .find('button')
      .contains(/let's go/i)
      .click()

    // example:  https://live-radio.vercel.app/app/by-location/EU/RS
    const location = new RegExp(
      `/app/by-location/${countryCode.cont}/${countryCode.code}$`
    )

    cy.location('pathname', { timeout: 10000 }).should('match', location)
  })
})
