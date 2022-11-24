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
      // $findPizzaItems: () => screen.getAllByTestId(/^pizza-item-/),
      // screen.get(/^pizza-item-/),
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
      // graphql.query('Pizzas', (_request, response, context) => {
      //     return response(
      //     context.data({
      //         loading: false,
      //         pizzas: [...data],
      //     })
      //     );
      // })
    );
  };

  beforeEach(() => {
    const pizza1 = createTestPizza();
    // const pizza2 = createTestPizza();
    mockPizzasQuery([pizza1 /* , pizza2 */]);
  });

  //   beforeAll(() => server.listen());
  // afterAll(() => server.close());
  // afterEach(() => {
  //   server.resetHandlers()
  // });

  test('should display a list of pizzas', async () => {
    const { $findPizzaItems } = renderPizzaList();

    expect(await $findPizzaItems()).toHaveLength(2);
  });
});
