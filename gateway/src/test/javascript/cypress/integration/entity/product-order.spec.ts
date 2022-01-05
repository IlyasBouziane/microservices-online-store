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

describe('ProductOrder e2e test', () => {
  const productOrderPageUrl = '/product-order';
  const productOrderPageUrlPattern = new RegExp('/product-order(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const productOrderSample = { placedDate: '2022-01-05T08:20:51.728Z', status: 'COMPLETED', code: 'paradigm Account adapter' };

  let productOrder: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/productorder/api/product-orders+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/productorder/api/product-orders').as('postEntityRequest');
    cy.intercept('DELETE', '/services/productorder/api/product-orders/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (productOrder) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/productorder/api/product-orders/${productOrder.id}`,
      }).then(() => {
        productOrder = undefined;
      });
    }
  });

  it('ProductOrders menu should load ProductOrders page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-order');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ProductOrder').should('exist');
    cy.url().should('match', productOrderPageUrlPattern);
  });

  describe('ProductOrder page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(productOrderPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ProductOrder page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/product-order/new$'));
        cy.getEntityCreateUpdateHeading('ProductOrder');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productOrderPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/productorder/api/product-orders',
          body: productOrderSample,
        }).then(({ body }) => {
          productOrder = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/productorder/api/product-orders+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [productOrder],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(productOrderPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ProductOrder page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('productOrder');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productOrderPageUrlPattern);
      });

      it('edit button click should load edit ProductOrder page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProductOrder');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productOrderPageUrlPattern);
      });

      it('last delete button click should delete instance of ProductOrder', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('productOrder').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productOrderPageUrlPattern);

        productOrder = undefined;
      });
    });
  });

  describe('new ProductOrder page', () => {
    beforeEach(() => {
      cy.visit(`${productOrderPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('ProductOrder');
    });

    it('should create an instance of ProductOrder', () => {
      cy.get(`[data-cy="placedDate"]`).type('2022-01-05T14:42').should('have.value', '2022-01-05T14:42');

      cy.get(`[data-cy="status"]`).select('PENDING');

      cy.get(`[data-cy="invoiceId"]`).type('74076').should('have.value', '74076');

      cy.get(`[data-cy="code"]`).type('Up-sized').should('have.value', 'Up-sized');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        productOrder = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', productOrderPageUrlPattern);
    });
  });
});
