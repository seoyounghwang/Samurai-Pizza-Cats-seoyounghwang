import {
  CreatePizzaInput,
  DeletePizzaInput,
  Pizza as PizzaSchema,
  GetPizzasResponse as SchemaGetPizzasResponse,
  UpdateToppingInput,
} from '../schema/types/schema';
import { pizzaProvider } from '../providers';
import { Root } from '../schema/types/types';
import { ObjectId } from 'mongodb';
import { GetCursorResultsInput } from '../providers/pizzas/pizza.provider.types';

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
    pizzaResults: async (_: Root, args: { input?: GetCursorResultsInput }): Promise<GetPizzasResponse> => {
      // return pizzaProvider.getPizzas(args.input);
      const cursor = args.input?.cursor !== undefined ? args.input.cursor : 'empty';
      const limit = args.input?.limit !== undefined ? args.input.limit : 0;
      const sort = args.input?.sort !== undefined ? args.input.sort : 0;
      const result = await pizzaProvider.getPizzas({
        limit: limit,
        cursor: cursor,
        sort: sort,
      });
      return result;
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
