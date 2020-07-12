describe('Authentication', () => {
  it('Can sign in as admin', () => {
    cy.visit('/account/signin');

    cy.get('input#email').type('admin@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();

    cy.location('pathname').should('eq', '/');
  });

  it('Can sign in as driver', () => {
    cy.visit('/account/signin');

    cy.get('input#email').type('driver@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();

    cy.location('pathname').should('eq', '/driver');
  });

  it('Can sign in as rider', () => {
    cy.visit('/account/signin');

    cy.get('input#email').type('rider@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();

    cy.location('pathname').should('eq', '/rider');
  });
});
