import { ObjectID } from 'bson';
import { PizzaDocument } from '../../src/entities/pizza';
import { Pizza } from '../../src/application/schema/types/schema';

const createMockPizza = (data?: Partial<Pizza>): Pizza => {
  return {
    __typename: 'Pizza',
    id: new ObjectID().toHexString(),
    name: 'Lovey',
    description: 'Jest pizza',
    imgSrc: 'http://cm1.narvii.com/6874/bcc63b6b6fa12d68d8b0a8488de55282d701df4c_00.jpg',
    toppings: [],
    priceCents: 700,
    // toppingIds: [],
    ...data,
  };
};

const createMockPizzaDocument = (data?: Partial<PizzaDocument>): PizzaDocument => {
  return {
    _id: new ObjectID(),
    name: 'Lovey',
    description: 'Jest pizza',
    imgSrc: 'http://cm1.narvii.com/6874/bcc63b6b6fa12d68d8b0a8488de55282d701df4c_00.jpg',
    //no toppings and priceCents
    toppingIds: [],
    ...data,
  };
};

export { createMockPizza, createMockPizzaDocument };
