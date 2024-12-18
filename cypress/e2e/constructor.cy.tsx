import * as orderFixture from '../fixtures/order.json';

const BUN_SELECTOR = '[data-ingredient="bun"]:first-of-type';
const MAIN_INGREDIENT_SELECTOR = '[data-ingredient="main"]:first-of-type';

const MODAL_SELECTOR = '#modals';

const ORDER_BUTTON_SELECTOR = '[data-order-button]';
const MODAL_CLOSE_BUTTON_SELECTOR = `${MODAL_SELECTOR} button:first-of-type`;
const MODAL_OVERLAY_SELECTOR = `${MODAL_SELECTOR} > div:nth-of-type(2)`;

describe('E2E тест создания заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  it('Протестировано добавление ингредиента из списка в конструктор.', () => {
    cy.get(BUN_SELECTOR).should('have.length.at.least', 1);
    cy.get('[data-ingredient="main"],[data-ingredient="sauce"]').should(
      'have.length.at.least',
      1
    );
  });

  describe('Тестирование работы модальных окон.', () => {
    describe('Проверка открытия модальных окон', () => {
      it('Открытие модального окна ингредиента', () => {
        cy.get(BUN_SELECTOR).click();
        cy.get(MODAL_SELECTOR).children().should('have.length', 2);
      });

      it('Открытие модального окна ингредиента при перезагрузке страницы', () => {
        cy.get(BUN_SELECTOR).click();
        cy.reload(true);
        cy.get(MODAL_SELECTOR).children().should('have.length', 2);
      });
    });

    describe('Проверка успешности закрытия модальных окон и что конструктор пуст.', () => {
      it('Закрытие по клику на крестик', () => {
        cy.get(BUN_SELECTOR).click();
        cy.get(MODAL_CLOSE_BUTTON_SELECTOR).click();
        cy.wait(500);
        cy.get(MODAL_SELECTOR).children().should('have.length', 0);
      });

      it('Закрытие по клику на оверлей', () => {
        cy.get(BUN_SELECTOR).click();
        cy.get(MODAL_OVERLAY_SELECTOR).click({ force: true });
        cy.wait(500);
        cy.get(MODAL_SELECTOR).children().should('have.length', 0);
      });

      it('Закрытие по нажатию на Escape', () => {
        cy.get(BUN_SELECTOR).click();
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get(MODAL_SELECTOR).children().should('have.length', 0);
      });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      cy.visit('/');
    });

    it('Оформление заказа авторизованным пользователем c последующим закрытием модалки c перехватом запроса через intercept', () => {
      cy.get(`${BUN_SELECTOR} button`).click();
      cy.get(`${MAIN_INGREDIENT_SELECTOR} button`).click();
      cy.get(ORDER_BUTTON_SELECTOR).should('be.enabled');

      cy.get(ORDER_BUTTON_SELECTOR).click();
      cy.get(MODAL_SELECTOR).children().should('have.length', 2);

      cy.get(`${MODAL_SELECTOR} h2:first-of-type`).should(
        'have.text',
        orderFixture.order.number
      );

      cy.intercept('POST', 'api/orders').as('placeOrder');

      cy.get(MODAL_CLOSE_BUTTON_SELECTOR).click();
      cy.get(MODAL_SELECTOR).children().should('have.length', 0);

      cy.contains('Соберите бургер').children().should('have.length', 0);
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
