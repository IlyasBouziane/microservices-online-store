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

describe('Notification e2e test', () => {
  const notificationPageUrl = '/notification';
  const notificationPageUrlPattern = new RegExp('/notification(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const notificationSample = {
    date: '2022-01-05T12:11:03.480Z',
    sentDate: '2022-01-05T04:24:06.824Z',
    format: 'PARCEL',
    userId: 94565,
    productId: 69326,
  };

  let notification: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/notification/api/notifications+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/notification/api/notifications').as('postEntityRequest');
    cy.intercept('DELETE', '/services/notification/api/notifications/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (notification) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/notification/api/notifications/${notification.id}`,
      }).then(() => {
        notification = undefined;
      });
    }
  });

  it('Notifications menu should load Notifications page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('notification');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Notification').should('exist');
    cy.url().should('match', notificationPageUrlPattern);
  });

  describe('Notification page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(notificationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Notification page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/notification/new$'));
        cy.getEntityCreateUpdateHeading('Notification');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', notificationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/notification/api/notifications',
          body: notificationSample,
        }).then(({ body }) => {
          notification = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/notification/api/notifications+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [notification],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(notificationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Notification page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('notification');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', notificationPageUrlPattern);
      });

      it('edit button click should load edit Notification page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Notification');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', notificationPageUrlPattern);
      });

      it('last delete button click should delete instance of Notification', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('notification').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', notificationPageUrlPattern);

        notification = undefined;
      });
    });
  });

  describe('new Notification page', () => {
    beforeEach(() => {
      cy.visit(`${notificationPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Notification');
    });

    it('should create an instance of Notification', () => {
      cy.get(`[data-cy="date"]`).type('2022-01-04T20:28').should('have.value', '2022-01-04T20:28');

      cy.get(`[data-cy="details"]`).type('calculate').should('have.value', 'calculate');

      cy.get(`[data-cy="sentDate"]`).type('2022-01-04T20:33').should('have.value', '2022-01-04T20:33');

      cy.get(`[data-cy="format"]`).select('SMS');

      cy.get(`[data-cy="userId"]`).type('30398').should('have.value', '30398');

      cy.get(`[data-cy="productId"]`).type('90054').should('have.value', '90054');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        notification = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', notificationPageUrlPattern);
    });
  });
});
