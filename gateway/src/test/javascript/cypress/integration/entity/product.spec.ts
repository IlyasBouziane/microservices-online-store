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

describe('Product e2e test', () => {
  const productPageUrl = '/product';
  const productPageUrlPattern = new RegExp('/product(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const productSample = { sku: 'Usability Neck', upc: '24/7 monetize', name: 'calculate', price: 11622, productSize: 'M' };

  let product: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/productorder/api/products+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/productorder/api/products').as('postEntityRequest');
    cy.intercept('DELETE', '/services/productorder/api/products/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (product) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/productorder/api/products/${product.id}`,
      }).then(() => {
        product = undefined;
      });
    }
  });

  it('Products menu should load Products page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('product');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Product').should('exist');
    cy.url().should('match', productPageUrlPattern);
  });

  describe('Product page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(productPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Product page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/product/new$'));
        cy.getEntityCreateUpdateHeading('Product');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/productorder/api/products',
          body: productSample,
        }).then(({ body }) => {
          product = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/productorder/api/products+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [product],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(productPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Product page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('product');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productPageUrlPattern);
      });

      it('edit button click should load edit Product page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Product');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productPageUrlPattern);
      });

      it('last delete button click should delete instance of Product', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('product').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productPageUrlPattern);

        product = undefined;
      });
    });
  });

  describe('new Product page', () => {
    beforeEach(() => {
      cy.visit(`${productPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Product');
    });

    it('should create an instance of Product', () => {
      cy.get(`[data-cy="sku"]`).type('Rustic Tasty').should('have.value', 'Rustic Tasty');

      cy.get(`[data-cy="upc"]`).type('stable Crest').should('have.value', 'stable Crest');

      cy.get(`[data-cy="name"]`).type('Buckinghamshire Idaho Visionary').should('have.value', 'Buckinghamshire Idaho Visionary');

      cy.get(`[data-cy="description"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="price"]`).type('93519').should('have.value', '93519');

      cy.get(`[data-cy="productSize"]`).select('M');

      cy.get(`[data-cy="colors"]`).type('qycid,oulhvk,m,fcldjq,x,it').should('have.value', 'qycid,oulhvk,m,fcldjq,x,it');

      cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png');

      cy.get(`[data-cy="imageSha1"]`)
        .type('982ccc1bcc29823dc41d79ea06ae3bb6ec4911bc')
        .should('have.value', '982ccc1bcc29823dc41d79ea06ae3bb6ec4911bc');

      cy.get(`[data-cy="imageCdnUrl"]`).type('THX compress').should('have.value', 'THX compress');

      cy.get(`[data-cy="thumbnailSha1"]`)
        .type('65b2b1d9a95fa9547821bff8e0d51159e20648fc')
        .should('have.value', '65b2b1d9a95fa9547821bff8e0d51159e20648fc');

      cy.get(`[data-cy="thumbnailCdnUrl"]`).type('Pennsylvania parse').should('have.value', 'Pennsylvania parse');

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        product = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', productPageUrlPattern);
    });
  });
});
