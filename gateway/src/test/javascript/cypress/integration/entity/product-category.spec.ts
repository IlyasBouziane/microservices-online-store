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

describe('ProductCategory e2e test', () => {
  const productCategoryPageUrl = '/product-category';
  const productCategoryPageUrlPattern = new RegExp('/product-category(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const productCategorySample = { name: 'Books' };

  let productCategory: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/productorder/api/product-categories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/productorder/api/product-categories').as('postEntityRequest');
    cy.intercept('DELETE', '/services/productorder/api/product-categories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (productCategory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/productorder/api/product-categories/${productCategory.id}`,
      }).then(() => {
        productCategory = undefined;
      });
    }
  });

  it('ProductCategories menu should load ProductCategories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-category');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ProductCategory').should('exist');
    cy.url().should('match', productCategoryPageUrlPattern);
  });

  describe('ProductCategory page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(productCategoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ProductCategory page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/product-category/new$'));
        cy.getEntityCreateUpdateHeading('ProductCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productCategoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/productorder/api/product-categories',
          body: productCategorySample,
        }).then(({ body }) => {
          productCategory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/productorder/api/product-categories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [productCategory],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(productCategoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ProductCategory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('productCategory');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productCategoryPageUrlPattern);
      });

      it('edit button click should load edit ProductCategory page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProductCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productCategoryPageUrlPattern);
      });

      it('last delete button click should delete instance of ProductCategory', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('productCategory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', productCategoryPageUrlPattern);

        productCategory = undefined;
      });
    });
  });

  describe('new ProductCategory page', () => {
    beforeEach(() => {
      cy.visit(`${productCategoryPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('ProductCategory');
    });

    it('should create an instance of ProductCategory', () => {
      cy.get(`[data-cy="name"]`).type('paradigm Intelligent').should('have.value', 'paradigm Intelligent');

      cy.get(`[data-cy="description"]`).type('Metal Soap Account').should('have.value', 'Metal Soap Account');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        productCategory = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', productCategoryPageUrlPattern);
    });
  });
});
