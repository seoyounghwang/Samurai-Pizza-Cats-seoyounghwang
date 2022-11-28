import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pizza {
    id: ObjectID!
    name: String!
    description: String!
    imgSrc: String!
    toppings: [Topping!]!
    priceCents: Int!
    # test
    toppingIds: [ObjectID!]!
  }
  type Query {
    pizzas: [Pizza!]!
    pizzaResults(input: CursorInput): GetPizzasResponse!
  }

  type PizzaQueryArgs {
    id: ObjectID!
  }

  type Mutation {
    createPizza(input: CreatePizzaInput!): Pizza!
    deletePizza(input: DeletePizzaInput!): ObjectID!
    updatePizza(input: UpdatePizzaInput!): Pizza!
  }

  input CreatePizzaInput {
    name: String!
    description: String!
    imgSrc: String!
    toppingIds: [ObjectID!]!
  }

  input DeletePizzaInput {
    id: ObjectID!
  }

  input UpdatePizzaInput {
    id: ObjectID!
    name: String
    description: String
    imgSrc: String
    toppingIds: [ObjectID]
  }
  # test

  type GetPizzasResponse {
    totalCount: Int
    hasNextPage: Boolean!
    cursor: String
    results: [Pizza!]!
  }

  input CursorInput {
    cursor: ObjectID
    limit: Int
    sort: Int
  }
`;

export { typeDefs };
