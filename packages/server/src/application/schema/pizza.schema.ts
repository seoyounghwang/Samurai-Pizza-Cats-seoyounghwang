import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pizza {
    id: ObjectID!
    name: String!
    description: String!
    toppingIds: [String!]!
    imgSrc: String!
    toppings: [Topping!]!
    priceCents: Int!
  }
  type Query {
    pizzas: [Pizza!]!
  }

  type PizzaQueryArgs {
    id: ObjectID!
  }

  type Mutation {
    createPizza(input: CreatePizzaInput!): Pizza!
  }

  input CreatePizzaInput {
    name: String!
    description: String!
    imgSrc: String!
    toppingIds: [ObjectID!]!
  }
`;

export { typeDefs };
