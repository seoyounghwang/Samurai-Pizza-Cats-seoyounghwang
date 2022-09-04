import { gql } from 'apollo-server-core';

import { typeDefs as toppingTypeDefs } from './topping.schema';

const scalarSchema = gql`
  scalar ObjectID
  scalar Long
`;

const typeDefs = gql`
  ${scalarSchema}
  ${toppingTypeDefs}
`;

export { typeDefs };
