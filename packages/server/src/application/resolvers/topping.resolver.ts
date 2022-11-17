import { CreateToppingInput, DeleteToppingInput, Pizza, Topping, UpdateToppingInput } from '../schema/types/schema';
import { Root } from '../schema/types/types';
import { toppingProvider } from '../providers';
import { ObjectId } from 'mongodb';
// import { Pizza } from '../providers/pizzas/pizza.provider.types';

const toppingResolver = {
  Query: {
    toppings: async (): Promise<Topping[]> => {
      return toppingProvider.getToppings();
    },
  },

  Pizza: {
    toppings: async (parent: { toppingIds: ObjectId[] }): Promise<Topping[]> => {
      return toppingProvider.getToppingsById(parent.toppingIds);
    },
    priceCents: async (parent: { toppingIds: ObjectId[] }): Promise<number> => {
      return toppingProvider.getPriceCents(parent.toppingIds);
    },
  },

  Mutation: {
    createTopping: async (_: Root, args: { input: CreateToppingInput }): Promise<Topping> => {
      return toppingProvider.createTopping(args.input);
    },

    deleteTopping: async (_: Root, args: { input: DeleteToppingInput }): Promise<string> => {
      return toppingProvider.deleteTopping(args.input.id);
    },

    updateTopping: async (_: Root, args: { input: UpdateToppingInput }): Promise<Topping> => {
      return toppingProvider.updateTopping(args.input);
    },
  },
};

export { toppingResolver };
