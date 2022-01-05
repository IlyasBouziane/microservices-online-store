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

describe('OrderItem e2e test', () => {
  const orderItemPageUrl = '/order-item';
  const orderItemPageUrlPattern = new RegExp('/order-item(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const orderItemSample = { quantity: 51870, totalPrice: 70011, status: 'OUT_OF_STOCK' };

  let orderItem: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/productorder/api/order-items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/productorder/api/order-items').as('postEntityRequest');
    cy.intercept('DELETE', '/services/productorder/api/order-items/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (orderItem) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/productorder/api/order-items/${orderItem.id}`,
      }).then(() => {
        orderItem = undefined;
      });
    }
  });

  it('OrderItems menu should load OrderItems page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('order-item');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('OrderItem').should('exist');
    cy.url().should('match', orderItemPageUrlPattern);
  });

  describe('OrderItem page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(orderItemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create OrderItem page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/order-item/new$'));
        cy.getEntityCreateUpdateHeading('OrderItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', orderItemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/productorder/api/order-items',
          body: orderItemSample,
        }).then(({ body }) => {
          orderItem = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/productorder/api/order-items+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [orderItem],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(orderItemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details OrderItem page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('orderItem');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', orderItemPageUrlPattern);
      });

      it('edit button click should load edit OrderItem page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OrderItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', orderItemPageUrlPattern);
      });

      it('last delete button click should delete instance of OrderItem', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('orderItem').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', orderItemPageUrlPattern);

        orderItem = undefined;
      });
    });
  });

  describe('new OrderItem page', () => {
    beforeEach(() => {
      cy.visit(`${orderItemPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('OrderItem');
    });

    it('should create an instance of OrderItem', () => {
      cy.get(`[data-cy="quantity"]`).type('25675').should('have.value', '25675');

      cy.get(`[data-cy="totalPrice"]`).type('54687').should('have.value', '54687');

      cy.get(`[data-cy="status"]`).select('OUT_OF_STOCK');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        orderItem = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', orderItemPageUrlPattern);
    });
  });
});
