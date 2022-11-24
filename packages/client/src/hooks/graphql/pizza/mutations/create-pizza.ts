import { gql } from '@apollo/client';

export const CREATE_PIZZA = gql`
  mutation Mutation($createPizzaInput: CreatePizzaInput!) {
    createPizza(input: $createPizzaInput) {
      name
      description
      imgSrc
      toppingIds
    }
  }
`;
