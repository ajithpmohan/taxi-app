describe('Authentication', () => {
  it('Can sign in as admin', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://0.0.0.0:9000/api/v1/account/token/',
      response: {
        refresh: 'REFRESH_TOKEN',
        access: 'ACCESS_TOKEN',
        user: {
          email: 'admin@example.com',
          fullname: 'Admin',
          avatar: null,
          type: 'ADMIN',
        },
      },
    });

    cy.visit('/account/signin');

    cy.get('input#email').type('admin@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();

    cy.location('pathname').should('eq', '/');
  });

  it('Can sign in as driver', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://0.0.0.0:9000/api/v1/account/token/',
      response: {
        refresh: 'REFRESH_TOKEN',
        access: 'ACCESS_TOKEN',
        user: {
          email: 'driver@example.com',
          fullname: 'Driver',
          avatar: null,
          type: 'DRIVER',
        },
      },
    });

    cy.visit('/account/signin');

    cy.get('input#email').type('driver@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();

    cy.location('pathname').should('eq', '/driver');
  });

  it('Can sign in as rider', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://0.0.0.0:9000/api/v1/account/token/',
      response: {
        refresh: 'REFRESH_TOKEN',
        access: 'ACCESS_TOKEN',
        user: {
          email: 'rider@example.com',
          fullname: 'Rider man',
          avatar: null,
          type: 'RIDER',
        },
      },
    });

    cy.visit('/account/signin');

    cy.get('input#email').type('rider@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();

    cy.location('pathname').should('eq', '/rider');
  });

  it('Can sign up', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://0.0.0.0:9000/api/v1/account/sign-up/',
      response: {
        message:
          'Account activation email sent to ajithpmohan@example.com',
      },
    });

    cy.visit('/account/signup');

    cy.get('input#email').type('ajithpmohan@example.com');
    cy.get('input#firstName').type('Ajith');
    cy.get('input#lastName').type('P Mohan');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('input#password2').type('abc12345', { log: false });
    cy.get('select#groups').select('RIDER');
    cy.get('button').contains('Sign Up').click();

    cy.location('pathname').should('eq', '/');
  });
});
