import * as orderFixture from '../fixtures/order.json';

describe('E2E тест создания заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

    cy.visit('/');
  });

  it('Протестировано добавление ингредиента из списка в конструктор.', () => {
    cy.get('[data-ingredient="bun"]').should('have.length.at.least', 1);
    cy.get('[data-ingredient="main"],[data-ingredient="sauce"]').should(
      'have.length.at.least',
      1
    );
  });

  describe('Тестирование работы модальных окон.', () => {
    describe('Проверка открытия модальных окон', () => {
      it('Открытие модального окна ингредиента', () => {
        cy.get('[data-ingredient="bun"]:first-of-type').click();
        cy.get('#modals').children().should('have.length', 2);
      });

      it('Открытие модального окна ингредиента при перезагрузке страницы', () => {
        cy.get('[data-ingredient="bun"]:first-of-type').click();
        cy.reload(true);
        cy.get('#modals').children().should('have.length', 2);
      });
    });

    describe('Проверка успешности закрытия модальных окон и что конструктор пуст.', () => {
      it('Закрытие по клику на крестик', () => {
        cy.get('[data-ingredient="bun"]:first-of-type').click();
        cy.get('#modals button:first-of-type').click();
        cy.wait(500);
        cy.get('#modals').children().should('have.length', 0);
      });

      it('Закрытие по клику на оверлей', () => {
        cy.get('[data-ingredient="bun"]:first-of-type').click();
        cy.get('#modals>div:nth-of-type(2)').click({ force: true });
        cy.wait(500);
        cy.get('#modals').children().should('have.length', 0);
      });

      it('Закрытие по нажатию на Escape', () => {
        cy.get('[data-ingredient="bun"]:first-of-type').click();
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get('#modals').children().should('have.length', 0);
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

    it('Оформление заказа авторизованным пользователем c последующим закрытием модалки', () => {
      cy.get('[data-ingredient="bun"]:first-of-type button').click();
      cy.get('[data-ingredient="main"]:first-of-type button').click();
      cy.get('[data-order-button]').should('be.enabled');

      cy.get('[data-order-button]').click();
      cy.get('#modals').children().should('have.length', 2);

      cy.get('#modals h2:first-of-type').should(
        'have.text',
        orderFixture.order.number
      );

      cy.get('#modals button:first-of-type').click();
      cy.get('#modals').children().should('have.length', 0);

      cy.contains('Соберите бургер').children().should('have.length', 0);
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
