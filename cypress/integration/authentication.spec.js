/// <reference types="cypress" />

describe('Authentication', () => {
  it('Can sign up', () => {
    // stub API call
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

  it('Can log in as admin', () => {
    // stub API call
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
    cy.get('button')
      .contains('Sign In')
      .click()
      .should(() => {
        expect(
          JSON.parse(localStorage.getItem('authUser')).user.email,
        ).to.eq('admin@example.com');
      });

    cy.location('pathname').should('eq', '/');
  });

  it('Can log in as driver', () => {
    // stub API call
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
    cy.get('button')
      .contains('Sign In')
      .click()
      .should(() => {
        expect(
          JSON.parse(localStorage.getItem('authUser')).user.email,
        ).to.eq('driver@example.com');
      });

    cy.location('pathname').should('eq', '/driver');
  });

  it('Can log in as rider', () => {
    // stub API call
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://0.0.0.0:9000/api/v1/account/token/',
      response: {
        refresh: 'REFRESH_TOKEN',
        access: 'ACCESS_TOKEN',
        user: {
          email: 'rider@example.com',
          fullname: 'Rider',
          avatar: null,
          type: 'RIDER',
        },
      },
    });

    cy.visit('/account/signin');

    cy.get('input#email').type('rider@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button')
      .contains('Sign In')
      .click()
      .should(() => {
        expect(
          JSON.parse(localStorage.getItem('authUser')).user.email,
        ).to.eq('rider@example.com');
      });

    cy.location('pathname').should('eq', '/rider');
  });
  it('Can log out', () => {
    // stub API call
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
    cy.get('button')
      .contains('Sign In')
      .click()
      .should(() => {
        expect(
          JSON.parse(localStorage.getItem('authUser')).user.email,
        ).to.eq('admin@example.com');
      });

    cy.location('pathname').should('eq', '/');

    cy.get('button#navbarDropdownMenuLink').click();
    cy.get('button')
      .contains('SignOut')
      .click()
      .should(() => {
        expect(localStorage.getItem('authUser')).to.be.null;
      });
  });

  it('Cannot visit the login or signup pages when logged in', () => {
    // stub API call
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://0.0.0.0:9000/api/v1/account/token/',
      response: {
        refresh: 'REFRESH_TOKEN',
        access: 'ACCESS_TOKEN',
        user: {
          email: 'rider@example.com',
          fullname: 'Rider',
          avatar: null,
          type: 'RIDER',
        },
      },
    });

    cy.visit('/account/signin');
    cy.location('pathname').should('eq', '/account/signin');

    cy.get('input#email').type('rider@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button')
      .contains('Sign In')
      .click()
      .should(() => {
        expect(
          JSON.parse(localStorage.getItem('authUser')).user.email,
        ).to.eq('rider@example.com');
      });

    cy.location('pathname').should('eq', '/rider');

    cy.visit('/account/signin');
    cy.location('pathname').should('eq', '/rider');

    cy.visit('/account/signup');
    cy.location('pathname').should('eq', '/rider');
  });
});
