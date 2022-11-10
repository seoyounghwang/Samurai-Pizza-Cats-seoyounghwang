import { Topping } from '../toppings/topping.provider.types';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppingIds: string[];
  imgSrc: string;
  toppings: Topping[];
  priceCents: number;
}

export interface CreatePizzaInput {
  name: string;
  description: string;
  imgSrc: string;
  toppingIds: string[];
}
