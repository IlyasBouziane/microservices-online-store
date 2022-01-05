import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Customer e2e test', () => {
  const customerPageUrl = '/customer';
  const customerPageUrlPattern = new RegExp('/customer(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const customerSample = {
    userId: 74229,
    firstName: 'Ralph',
    lastName: 'Greenfelder',
    gender: 'FEMALE',
    email: 'Rosario87@yahoo.com',
    phone: '976-758-0839',
    addressLine1: 'Overpass holistic Associate',
    city: 'Port Hopeshire',
    country: 'Palestinian Territory',
  };

  let customer: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/productorder/api/customers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/productorder/api/customers').as('postEntityRequest');
    cy.intercept('DELETE', '/services/productorder/api/customers/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (customer) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/productorder/api/customers/${customer.id}`,
      }).then(() => {
        customer = undefined;
      });
    }
  });

  it('Customers menu should load Customers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Customer').should('exist');
    cy.url().should('match', customerPageUrlPattern);
  });

  describe('Customer page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(customerPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Customer page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/customer/new$'));
        cy.getEntityCreateUpdateHeading('Customer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', customerPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/productorder/api/customers',
          body: customerSample,
        }).then(({ body }) => {
          customer = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/productorder/api/customers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [customer],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(customerPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Customer page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('customer');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', customerPageUrlPattern);
      });

      it('edit button click should load edit Customer page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Customer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', customerPageUrlPattern);
      });

      it('last delete button click should delete instance of Customer', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('customer').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', customerPageUrlPattern);

        customer = undefined;
      });
    });
  });

  describe('new Customer page', () => {
    beforeEach(() => {
      cy.visit(`${customerPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Customer');
    });

    it('should create an instance of Customer', () => {
      cy.get(`[data-cy="userId"]`).type('36761').should('have.value', '36761');

      cy.get(`[data-cy="firstName"]`).type('Quinton').should('have.value', 'Quinton');

      cy.get(`[data-cy="lastName"]`).type('Kassulke').should('have.value', 'Kassulke');

      cy.get(`[data-cy="gender"]`).select('FEMALE');

      cy.get(`[data-cy="email"]`).type('Myah51@hotmail.com').should('have.value', 'Myah51@hotmail.com');

      cy.get(`[data-cy="phone"]`).type('(881) 736-8882').should('have.value', '(881) 736-8882');

      cy.get(`[data-cy="addressLine1"]`).type('Bedfordshire wireless').should('have.value', 'Bedfordshire wireless');

      cy.get(`[data-cy="addressLine2"]`).type('e-business Lek').should('have.value', 'e-business Lek');

      cy.get(`[data-cy="city"]`).type('East Chaimside').should('have.value', 'East Chaimside');

      cy.get(`[data-cy="country"]`).type('Iceland').should('have.value', 'Iceland');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        customer = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', customerPageUrlPattern);
    });
  });
});
