import { ObjectID } from 'bson';
import { PizzaDocument } from '../../src/entities/pizza';
import { CursorInput, GetPizzasResponse, Pizza } from '../../src/application/schema/types/schema';

const createMockPizza = (data?: Partial<Pizza>): Pizza => {
  return {
    __typename: 'Pizza',
    id: new ObjectID().toHexString(),
    name: 'Lovey',
    description: 'Jest pizza',
    imgSrc: 'http://cm1.narvii.com/6874/bcc63b6b6fa12d68d8b0a8488de55282d701df4c_00.jpg',
    toppings: [],
    priceCents: 700,
    toppingIds: [],
    ...data,
  };
};

const createMockPizzaDocument = (data?: Partial<PizzaDocument>): PizzaDocument => {
  return {
    _id: new ObjectID(),
    name: 'Lovey',
    description: 'Jest pizza',
    imgSrc: 'http://cm1.narvii.com/6874/bcc63b6b6fa12d68d8b0a8488de55282d701df4c_00.jpg',
    toppingIds: [],
    toppings: [],
    priceCents: 0,
    ...data,
  };
};

const createMockPizzaCursorResult = (data?: CursorInput): GetPizzasResponse => {
  return {
    __typename: 'GetPizzasResponse',
    results: [
      {
        __typename: 'Pizza',
        id: '638425db4ddffd183e948b5c',
        name: 'Lovey',
        description: 'Jest pizza',
        imgSrc: 'http://cm1.narvii.com/6874/bcc63b6b6fa12d68d8b0a8488de55282d701df4c_00.jpg',
        toppingIds: [],
        toppings: [],
        priceCents: 250,
        ...data,
      },
    ],
    hasNextPage: true,
    totalCount: 1,
    cursor: 'd48b39393f18c374818712c4',
  };
};

export { createMockPizza, createMockPizzaDocument, createMockPizzaCursorResult };
