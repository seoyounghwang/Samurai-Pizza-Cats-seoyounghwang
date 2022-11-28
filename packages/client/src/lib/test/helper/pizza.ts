import { ObjectId } from 'bson';
import { Pizza } from '../../../types/schema';

export const createTestPizza = (data: Partial<Pizza> = {}): Pizza & { __typename: string } => ({
  __typename: 'Pizza',
  id: new ObjectId().toHexString(),
  name: 'A Pizza',
  description: 'Test Pizza Desc',
  imgSrc: 'test url',
  toppingIds: [],
  priceCents: 0,
  toppings: [],
  ...data,
});
