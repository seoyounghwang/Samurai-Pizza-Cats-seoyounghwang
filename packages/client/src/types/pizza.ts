import { Topping } from './topping';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  // toppingIds: string[];
  imgSrc: string;
  toppings?: Topping[];
  priceCents?: number;
}
