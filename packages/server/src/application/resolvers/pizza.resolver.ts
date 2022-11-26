import {
  CreatePizzaInput,
  DeletePizzaInput,
  Pizza as PizzaSchema,
  GetPizzasResponse as SchemaGetPizzasResponse,
  UpdateToppingInput,
  CursorInput,
} from '../schema/types/schema';
import { pizzaProvider } from '../providers';
import { Root } from '../schema/types/types';
import { ObjectId } from 'mongodb';

export type Pizza = Omit<PizzaSchema, 'toppings' | 'priceCents'> & {
  toppingIds: ObjectId[];
};

export type GetPizzasResponse = Omit<SchemaGetPizzasResponse, 'results'> & {
  results: Pizza[];
};

const pizzaResolver = {
  /* Query: {
    pizzas: async (): Promise<Pizza[]> => {
      return pizzaProvider.getPizzas();
    },
  }, */

  // const pizzaResolver = {
  Query: {
    pizzaResults: async (_: Root, args: { input: CursorInput }): Promise<GetPizzasResponse> => {
      return pizzaProvider.getPizzas(args.input);
    },
  },

  Mutation: {
    createPizza: async (_: Root, args: { input: CreatePizzaInput }): Promise<Pizza> => {
      return pizzaProvider.createPizza(args.input);
    },
    deletePizza: async (_: Root, args: { input: DeletePizzaInput }): Promise<string> => {
      return pizzaProvider.deletePizza(args.input.id);
    },

    updatePizza: async (_: Root, args: { input: UpdateToppingInput }): Promise<Pizza> => {
      return pizzaProvider.updatePizza(args.input);
    },
  },
};

export { pizzaResolver };
