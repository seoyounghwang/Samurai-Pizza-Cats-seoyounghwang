import { gql } from '@apollo/client';

const GET_PIZZAS = gql`
  query PizzaResults($input: CursorInput) {
    pizzaResults(input: $input) {
      __typename
      results {
        __typename
        id
        name
        description
        imgSrc
        priceCents

        toppings {
          __typename
          id
          name
          priceCents
        }
      }
      totalCount
      cursor
      hasNextPage
    }
  }
`;

export { GET_PIZZAS };
