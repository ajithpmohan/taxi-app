/// <reference types="cypress" />
import 'cypress-file-upload';

describe('Authentication', () => {
  it('Can sign up as driver', () => {
    // stub API call
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://server:8000/api/v1/account/sign-up/',
    }).as('signup');

    cy.visit('/account/sign-up');

    /*cy.fixture('images/rider.png').then((avatar) => {
      cy.get('input#avatar').attachFile({
        fileContent: avatar,
        fileName: 'avatar.jpg',
        mimeType: 'application/json',
      });
    });*/

    cy.get('input#email').type('ajithpmohan@example.com');
    cy.get('input#firstName').type('Ajith');
    cy.get('input#lastName').type('P Mohan');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('input#password2').type('abc12345', { log: false });
    cy.get('select#groups').select('DRIVER');
    cy.get('button').contains('Sign Up').click();
    cy.wait('@signup');
    cy.location('pathname').should('eq', '/');
  });


  it('Can sign up as rider', () => {
    // stub API call
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://server:8000/api/v1/account/sign-up/',
    }).as('signup');
    cy.visit('/account/sign-up');

/*    cy.fixture('images/rider.png').then((avatar) => {
      cy.get('input#avatar').attachFile({
        fileContent: avatar,
        fileName: 'avatar.jpg',
        mimeType: 'application/json',
      });
    });*/

    cy.get('input#email').type('regipmohan@example.com');
    cy.get('input#firstName').type('Regi');
    cy.get('input#lastName').type('P Mohan');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('input#password2').type('abc12345', { log: false });
    cy.get('select#groups').select('RIDER');
    cy.get('button').contains('Sign Up').click();

    cy.wait('@signup');
    cy.location('pathname').should('eq', '/');
  });


  it('Can log in as driver', () => {
    // stub API call
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://server:8000/api/v1/account/token/',
    }).as('login');

    cy.visit('/account/sign-in');

    cy.get('input#email').type('ajithpmohan@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();
    cy.wait('@login')
      .should(() => {
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        expect(authUser.user.email).to.eq('ajithpmohan@example.com');
        expect(authUser.user.fullname).to.eq('Ajith P Mohan');
        expect(authUser.user.type).to.eq('DRIVER');
      });

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/driver');
  });


  it('Can log in as rider', () => {
    // stub API call
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://server:8000/api/v1/account/token/',
    }).as('login');

    cy.visit('/account/sign-in');

    cy.get('input#email').type('regipmohan@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();
    cy.wait('@login')
      .should(() => {
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        expect(authUser.user.email).to.eq('regipmohan@example.com');
        expect(authUser.user.fullname).to.eq('Regi P Mohan');
        expect(authUser.user.type).to.eq('RIDER');
      });

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/rider');
  });


  it('Can log out', () => {
    // stub API call
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://server:8000/api/v1/account/token/',
    }).as('login');

    cy.visit('/account/sign-in');

    cy.get('input#email').type('ajithpmohan@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();
    cy.wait('@login')
      .should(() => {
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        expect(authUser.user.email).to.eq('ajithpmohan@example.com');
        expect(authUser.user.type).to.eq('DRIVER');
      });

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/driver');

    cy.get('button#navbarDropdownMenuLink').click();
    cy.get('button')
      .contains('SignOut')
      .click()
      .should(() => {
        expect(localStorage.getItem('authUser')).to.be.null;
      });

    cy.location('pathname').should('eq', '/');
  });


  it('Cannot visit the login or signup pages when logged in', () => {
    // stub API call
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://server:8000/api/v1/account/token/',
    }).as('login');

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/account/sign-in');

    cy.get('input#email').type('regipmohan@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();
    cy.wait('@login')
      .should(() => {
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        expect(authUser.user.email).to.eq('regipmohan@example.com');
        expect(authUser.user.type).to.eq('RIDER');
      });

    cy.location('pathname').should('eq', '/rider');

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/rider');

    cy.visit('/account/sign-up');
    cy.location('pathname').should('eq', '/rider');
  });
});
