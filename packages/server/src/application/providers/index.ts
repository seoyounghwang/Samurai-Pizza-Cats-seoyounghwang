import { setupDb } from '../database';

import { ToppingProvider } from './toppings/topping.provider';

const db = setupDb();

const toppingProvider = new ToppingProvider(db.collection('toppings'));

export { toppingProvider };
