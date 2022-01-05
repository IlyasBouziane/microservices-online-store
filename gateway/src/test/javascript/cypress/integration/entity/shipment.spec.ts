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

describe('Shipment e2e test', () => {
  const shipmentPageUrl = '/shipment';
  const shipmentPageUrlPattern = new RegExp('/shipment(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const shipmentSample = { date: '2022-01-05T05:29:46.621Z' };

  let shipment: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/invoice/api/shipments+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/invoice/api/shipments').as('postEntityRequest');
    cy.intercept('DELETE', '/services/invoice/api/shipments/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (shipment) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/invoice/api/shipments/${shipment.id}`,
      }).then(() => {
        shipment = undefined;
      });
    }
  });

  it('Shipments menu should load Shipments page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Shipment').should('exist');
    cy.url().should('match', shipmentPageUrlPattern);
  });

  describe('Shipment page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(shipmentPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Shipment page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/shipment/new$'));
        cy.getEntityCreateUpdateHeading('Shipment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', shipmentPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/invoice/api/shipments',
          body: shipmentSample,
        }).then(({ body }) => {
          shipment = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/invoice/api/shipments+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [shipment],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(shipmentPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Shipment page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('shipment');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', shipmentPageUrlPattern);
      });

      it('edit button click should load edit Shipment page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Shipment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', shipmentPageUrlPattern);
      });

      it('last delete button click should delete instance of Shipment', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('shipment').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', shipmentPageUrlPattern);

        shipment = undefined;
      });
    });
  });

  describe('new Shipment page', () => {
    beforeEach(() => {
      cy.visit(`${shipmentPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Shipment');
    });

    it('should create an instance of Shipment', () => {
      cy.get(`[data-cy="trackingCode"]`).type('Borders Intelligent pixel').should('have.value', 'Borders Intelligent pixel');

      cy.get(`[data-cy="date"]`).type('2022-01-05T09:58').should('have.value', '2022-01-05T09:58');

      cy.get(`[data-cy="details"]`).type('Keys index').should('have.value', 'Keys index');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        shipment = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', shipmentPageUrlPattern);
    });
  });
});
