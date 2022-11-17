import { ObjectId } from 'mongodb';
// import { Topping } from '../toppings/topping.provider.types'; */

export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppingIds: ObjectId[];
  imgSrc: string;
  /* toppings: Topping[];
  priceCents: number; */
}

export interface CreatePizzaInput {
  name: string;
  description: string;
  imgSrc: string;
  toppingIds: string[];
}

export interface UpdatePizzaInput {
  id: string;
  name?: string | null;
  description?: string | null;
  imgSrc?: string | null;
  toppingIds?: string[] | null;
}
