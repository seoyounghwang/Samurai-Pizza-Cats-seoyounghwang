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
    priceCents: 700,
    toppings: [
      {
        __typename: 'Topping',
        id: '564f0184537878b57efcb703',
        name: 'Tomato Sauce',
        priceCents: 250,
      },
      {
        __typename: 'Topping',
        id: 'e9e565e9a57cf33fb9b8ceed',
        name: 'BBQ Sauce',
        priceCents: 250,
      },
      {
        __typename: 'Topping',
        id: 'a10d50e732a0b1d4f2c5e506',
        name: 'Mozzarella',
        priceCents: 200,
      },
    ],
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
    toppingIds: ['564f0184537878b57efcb703', 'e9e565e9a57cf33fb9b8ceed', 'a10d50e732a0b1d4f2c5e506'],
    ...data,
  };
};

export { createMockPizza, createMockPizzaDocument };
