import { screen } from '@testing-library/react';
import { graphql } from 'msw';
import { server } from '../../../lib/test/msw-server';
import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import { Pizza } from '../../../types';
import { createTestPizza } from '../../../lib/test/helper/pizza';
import PizzaList from '../PizzaList';

describe('Pizzas', () => {
  const renderPizzaList = () => {
    const view = renderWithProviders(<PizzaList />);

    return {
      ...view,
      $findPizzaItems: () => screen.findAllByTestId(/^pizza-item-/),
      $findPizzaItemsButtons: () => screen.findAllByRole('button'),
    };
  };
  const mockPizzasQuery = (data: Partial<Pizza[]>) => {
    server.use(
      graphql.query('Pizzas', (_request, response, context) => {
        return response(
          context.data({
            lodaing: false,
            pizzas: [...data],
          })
        );
      })
    );
  };

  beforeEach(() => {
    const pizza1 = createTestPizza();
    mockPizzasQuery([pizza1]);
  });

  test('should display a list of pizzas', async () => {
    const { $findPizzaItems } = renderPizzaList();

    expect(await $findPizzaItems()).toHaveLength(2);
  });
});
