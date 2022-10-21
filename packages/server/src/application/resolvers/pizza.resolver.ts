import { Pizza } from '../schema/types/schema';
import { pizzaProvider } from '../providers';

const pizzaResolver = {
  Query: {
    pizzas: async (): Promise<Pizza[]> => {
      return pizzaProvider.getPizzas();
    },
  },
};

export { pizzaResolver };
