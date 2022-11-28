import { reveal, stub } from 'jest-auto-stub';
import { Collection } from 'mongodb';

import { PizzaProvider } from '../../src/application/providers/pizzas/pizza.provider';
import { ToppingProvider } from '../../src/application/providers/toppings/topping.provider';
import { PizzaDocument, toPizzaObject } from '../../src/entities/pizza';
import { ToppingDocument } from '../../src/entities/topping';
import { createMockPizzaDocument } from '../helpers/pizza.helper';
import { createMockToppingDocument } from '../helpers/topping.helper';
import { mockSortToArray } from '../helpers/mongo.helper';
import { CursorProvider } from '../../src/application/providers/pizzas/cursor.provider';

const stubPizzaCollection = stub<Collection<PizzaDocument>>();
const stubToppingCollection = stub<Collection<ToppingDocument>>();

const toppingProvider = new ToppingProvider(stubToppingCollection);
const cursorProvider = new CursorProvider(stubPizzaCollection);
const pizzaProvider = new PizzaProvider(stubPizzaCollection, toppingProvider, cursorProvider);

const CursorResultsInput = {
  limit: 1,
  cursor: 'empty',
  sort: 0,
};

beforeEach(jest.clearAllMocks);

describe('pizzaProvider', (): void => {
  const mockPizzaDocument = createMockPizzaDocument();
  const mockPizza = toPizzaObject(mockPizzaDocument);

  describe('getPizzas', (): void => {
    beforeEach(() => {
      reveal(stubPizzaCollection).find.mockImplementation(mockSortToArray([mockPizzaDocument]));
    });

    test('should call find once', async () => {
      await pizzaProvider.getPizzas();

      expect(stubPizzaCollection.find).toHaveBeenCalledTimes(1);
    });

    test('should get all pizzas', async () => {
      const result = await pizzaProvider.getPizzas();
      expect(result.results).toEqual([mockPizza]);
    });
  });
  describe('createPizza', (): void => {
    const validTopping = createMockToppingDocument({ name: 'test topping', priceCents: 500 });
    const validPizza = createMockPizzaDocument({
      name: 'test pizza',
      description: 'test pizza desc',
      imgSrc: 'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg',
      toppingIds: validTopping.id,
      priceCents: validTopping.priceCents,
    });

    beforeEach(() => {
      reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({ value: validPizza }));
      reveal(stubToppingCollection).find.mockImplementation(mockSortToArray([validTopping]));
    });
    test('should call findOneAndUpdate once', async () => {
      await pizzaProvider.createPizza({
        name: validPizza.name,
        description: validPizza.description,
        imgSrc: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds?.map((toppingId) => toppingId.toString()),
      });

      expect(stubPizzaCollection.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('should return a pizza when passed valid input', async () => {
      const result = await pizzaProvider.createPizza({
        name: validPizza.name,
        description: validPizza.description,
        imgSrc: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds?.map((toppingId) => toppingId.toString()),
      });
      expect(result).toEqual(toPizzaObject(validPizza));
    });
  });
  describe('deletePizza', (): void => {
    beforeEach(() => {
      reveal(stubPizzaCollection).findOneAndDelete.mockImplementation(() => ({ value: mockPizzaDocument }));
    });
    test('should call findOneAndDelete once', async () => {
      await pizzaProvider.deletePizza(mockPizza.id);

      expect(stubPizzaCollection.findOneAndDelete).toHaveBeenCalledTimes(1);
    });

    test('should throw an error if findOneAndDelete returns null for value', async () => {
      reveal(stubPizzaCollection).findOneAndDelete.mockImplementation(() => ({ value: null }));

      await expect(pizzaProvider.deletePizza(mockPizza.id)).rejects.toThrow(new Error('Could not delete the pizza'));
    });

    test('should return an id', async () => {
      const result = await pizzaProvider.deletePizza(mockPizza.id);

      expect(result).toEqual(mockPizza.id);
    });
  });
  describe('updatePizza', (): void => {
    const validTopping = createMockToppingDocument({ name: 'test topping', priceCents: 500 });
    const validPizza = createMockPizzaDocument({
      name: 'test pizza',
      description: 'test pizza desc',
      imgSrc: 'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg',
      toppingIds: validTopping.id,
      // toppings: validTopping,
      priceCents: validTopping.priceCents,
    });

    beforeEach(() => {
      reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({ value: validPizza }));
    });

    test('should call findOneAndUpdate once', async () => {
      await pizzaProvider.updatePizza({
        id: validPizza.id,
        name: validPizza.name,
        description: validPizza.description,
        imgSrc: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds?.map((toppingId) => toppingId.toString()),
      });

      expect(stubPizzaCollection.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('should return a topping', async () => {
      const result = await pizzaProvider.updatePizza({
        id: validPizza.id,
        name: validPizza.name,
        description: validPizza.description,
        imgSrc: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds?.map((toppingId) => toppingId.toString()),
      });

      expect(result).toEqual(toPizzaObject(validPizza));
    });
  });
});
