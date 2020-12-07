const serverUrl = Cypress.env('serverUrl');

describe('Authentication', () => {
  it('Can sign up as driver', () => {
    // network call
    cy.server();
    cy.route('POST', `${serverUrl}/account/sign-up/`).as('signup');

    cy.visit('/account/sign-up');

    cy.get('input#email').type('ajithpmohan@example.com');
    cy.get('input#firstName').type('Ajith');
    cy.get('input#lastName').type('P Mohan');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('input#password2').type('abc12345', { log: false });
    cy.get('select#groups').select('DRIVER');
    cy.get('input#avatar').attachFile('images/driver.jpeg');
    cy.get('button').contains('Sign Up').click();

    cy.wait('@signup');
    cy.get('div.Toastify').contains(
      'Account created successfully. Go to login Page.',
    );
    cy.wait(4000);
    cy.location('pathname').should('eq', '/account/sign-in');
  });

  it('Can sign up as rider', () => {
    // network call
    cy.server();
    cy.route('POST', `${serverUrl}/account/sign-up/`).as('signup');

    cy.visit('/account/sign-up');

    cy.get('input#email').type('regipmohan@example.com');
    cy.get('input#firstName').type('Regi');
    cy.get('input#lastName').type('P Mohan');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('input#password2').type('abc12345', { log: false });
    cy.get('select#groups').select('RIDER');
    cy.get('input#avatar').attachFile('images/rider.png');
    cy.get('button').contains('Sign Up').click();

    cy.wait('@signup');
    cy.get('div.Toastify').contains(
      'Account created successfully. Go to login Page.',
    );
    cy.wait(4000);
    cy.location('pathname').should('eq', '/account/sign-in');
  });

  it('Can log in as driver', () => {
    // network call
    cy.server();
    cy.route('POST', `${serverUrl}/account/token/`).as('login');

    cy.visit('/account/sign-in');

    cy.get('input#email').type('ajithpmohan@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();
    cy.wait('@login').should(() => {
      const authUser = JSON.parse(localStorage.getItem('authUser'));
      expect(authUser.user.email).to.eq('ajithpmohan@example.com');
      expect(authUser.user.fullname).to.eq('Ajith P Mohan');
      expect(authUser.user.role).to.eq('DRIVER');
    });

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/driver');
  });

  it('Can log in as rider', () => {
    // network call
    cy.server();
    cy.route('POST', `${serverUrl}/account/token/`).as('login');

    cy.visit('/account/sign-in');

    cy.get('input#email').type('regipmohan@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();
    cy.wait('@login').should(() => {
      const authUser = JSON.parse(localStorage.getItem('authUser'));
      expect(authUser.user.email).to.eq('regipmohan@example.com');
      expect(authUser.user.fullname).to.eq('Regi P Mohan');
      expect(authUser.user.role).to.eq('RIDER');
    });

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/rider');
  });

  it('Can log out', () => {
    // network call
    cy.server();
    cy.route('POST', `${serverUrl}/account/token/`).as('login');

    cy.visit('/account/sign-in');

    cy.get('input#email').type('ajithpmohan@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();
    cy.wait('@login').should(() => {
      const authUser = JSON.parse(localStorage.getItem('authUser'));
      expect(authUser.user.email).to.eq('ajithpmohan@example.com');
      expect(authUser.user.role).to.eq('DRIVER');
    });

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/driver');

    cy.get('button.navbarDropdownToggle').click();
    cy.get('button')
      .contains('SignOut')
      .click()
      .should(() => {
        expect(localStorage.getItem('authUser')).to.be.null;
      });

    cy.location('pathname').should('eq', '/');
  });

  it('Cannot visit the login or signup pages when logged in', () => {
    // network call
    cy.server();
    cy.route('POST', `${serverUrl}/account/token/`).as('login');

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/account/sign-in');

    cy.get('input#email').type('regipmohan@example.com');
    cy.get('input#password').type('abc12345', { log: false });
    cy.get('button').contains('Sign In').click();
    cy.wait('@login').should(() => {
      const authUser = JSON.parse(localStorage.getItem('authUser'));
      expect(authUser.user.email).to.eq('regipmohan@example.com');
      expect(authUser.user.role).to.eq('RIDER');
    });

    cy.location('pathname').should('eq', '/rider');

    cy.visit('/account/sign-in');
    cy.location('pathname').should('eq', '/rider');

    cy.visit('/account/sign-up');
    cy.location('pathname').should('eq', '/rider');
  });
});
