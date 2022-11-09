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
`;

export { typeDefs };
