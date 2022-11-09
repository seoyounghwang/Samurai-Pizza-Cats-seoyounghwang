import { gql } from '@apollo/client';

const GET_PIZZAS = gql`
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
    }
  }
`;

export { GET_PIZZAS };
