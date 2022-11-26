import { gql } from '@apollo/client';

/* const GET_PIZZAS = gql`
  query Pizzas {
    pizzas {
      id
      name
      description
      imgSrc
      toppings {
        id
        name
        priceCents
      }
      priceCents
    }
  }
`; */

const GET_PIZZAS = gql`
  query Pizzas($input: QueryInput!) {
    pizzas(input: $input) {
      results {
        id
        name
        description
        imgSrc
        toppings {
          id
          name
          priceCents
        }
        priceCents
      }
      totalCount
      hasNextPage
      cursor
    }
  }
`;

export { GET_PIZZAS };
