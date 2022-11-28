import { gql } from 'apollo-server-core';
import { pizzaProvider, toppingProvider } from '../../src/application/providers';
import { pizzaResolver } from '../../src/application/resolvers/pizza.resolver';
import { typeDefs } from '../../src/application/schema/index';
import {
  MutationCreatePizzaArgs,
  MutationDeletePizzaArgs,
  MutationUpdatePizzaArgs,
} from '../../src/application/schema/types/schema';
import { createMockPizza, createMockPizzaCursorResult } from '../helpers/pizza.helper';
import { TestClient } from '../helpers/client.helper';
import { createMockTopping } from '../helpers/topping.helper';
import { resourceLimits } from 'worker_threads';
import { ObjectId } from 'mongodb';

let client: TestClient;

jest.mock('../../src/application/database', () => ({
  setupDb: (): any => ({ collection: (): any => jest.fn() }),
}));

const mockPizza = createMockPizza();
const GetPizzasResponse = createMockPizzaCursorResult();
const mockTopping = createMockTopping();

beforeAll(async (): Promise<void> => {
  client = new TestClient(typeDefs, pizzaResolver);
});

beforeEach(async (): Promise<void> => {
  jest.restoreAllMocks();
});

describe('pizzaResolver', (): void => {
  describe('Query', () => {
    describe('pizzas', () => {
      const query = gql`
        query PizzaResults($input: CursorInput) {
          pizzaResults(input: $input) {
            __typename
            results {
              __typename
              id
              name
              description
              imgSrc
              priceCents
              toppingIds
              toppings {
                __typename
                id
                name
                priceCents
              }
            }
            totalCount
            cursor
            hasNextPage
          }
        }
      `;

      test('should get all pizzas', async () => {
        jest.spyOn(pizzaProvider, 'getPizzas').mockResolvedValue(GetPizzasResponse);

        const result = await client.query({ query });
        expect(result.data).toEqual({
          pizzaResults: {
            __typename: 'GetPizzasResponse',
            results: [
              {
                __typename: 'Pizza',
                id: '638425db4ddffd183e948b5c',
                name: 'Lovey',
                description: 'Jest pizza',
                imgSrc: 'http://cm1.narvii.com/6874/bcc63b6b6fa12d68d8b0a8488de55282d701df4c_00.jpg',
                priceCents: 250,
                toppingIds: [],
                toppings: [],
              },
            ],
            totalCount: 1,
            cursor: 'd48b39393f18c374818712c4',
            hasNextPage: true,
          },
        });

        expect(pizzaProvider.getPizzas).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('Mutation', () => {
    describe('createPizza', () => {
      const mutation = gql`
        mutation ($input: CreatePizzaInput!) {
          createPizza(input: $input) {
            name
            description
            imgSrc
            toppingIds
          }
        }
      `;

      const validPizza = createMockPizza({
        name: 'test pizza',
        description: 'test pizza desc',
        imgSrc: 'https://www.glutenfreepalate.com/wp-content/uploads/2018/08/Gluten-Free-Pizza-3.2.jpg',
        priceCents: 700,
        toppings: [],
      });

      beforeEach(() => {
        jest
          .spyOn(pizzaProvider, 'createPizza')
          .mockResolvedValue({ ...validPizza, toppingIds: validPizza.toppings.map((topping) => topping.id) });
      });

      test('should call create pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            name: validPizza.name,
            description: validPizza.description,
            imgSrc: validPizza.imgSrc,
            toppingIds: validPizza.toppingIds,
          },
        };

        await client.mutate({ mutation, variables });

        expect(pizzaProvider.createPizza).toHaveBeenCalledWith(variables.input);
      });

      test('should return created pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            name: validPizza.name,
            description: validPizza.description,
            imgSrc: validPizza.imgSrc,
            toppingIds: validPizza.toppings.map((topping) => topping.id),
          },
        };

        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          createPizza: {
            __typename: 'Pizza',
            name: validPizza.name,
            description: validPizza.description,
            imgSrc: validPizza.imgSrc,
            toppingIds: validPizza.toppingIds,
          },
        });
      });
    });

    describe('deletePizza', () => {
      const mutation = gql`
        mutation ($input: DeletePizzaInput!) {
          deletePizza(input: $input)
        }
      `;

      const variables: MutationDeletePizzaArgs = {
        input: { id: mockPizza.id },
      };

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'deletePizza').mockResolvedValue(mockPizza.id);
      });

      test('should call deletePizza with id', async () => {
        await client.mutate({ mutation, variables });

        expect(pizzaProvider.deletePizza).toHaveBeenCalledWith(variables.input.id);
      });

      test('should return deleted pizza id', async () => {
        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          deletePizza: mockPizza.id,
        });
      });
    });

    describe('updatePizza', () => {
      const mutation = gql`
        mutation ($input: UpdatePizzaInput!) {
          updatePizza(input: $input) {
            id
            name
            description
            imgSrc
            toppings {
              id
              name
              priceCents
            }
            priceCents
          }
        }
      `;

      const updatedPizza = createMockPizza({
        name: 'updated pizza',
        description: 'test updated pizza',
        imgSrc: 'updatedImg',
        toppings: [],
        priceCents: 500,
      });

      const variables: MutationUpdatePizzaArgs = {
        input: {
          id: mockPizza.id,
          name: updatedPizza.name,
          description: updatedPizza.description,
          imgSrc: updatedPizza.imgSrc,
          toppingIds: updatedPizza.toppings.map((topping) => topping.id),
        },
      };

      beforeEach(() => {
        jest
          .spyOn(pizzaProvider, 'updatePizza')
          .mockResolvedValue({ ...updatedPizza, toppingIds: updatedPizza.toppings.map((topping) => topping.id) });
      });

      test('should call updatePizza with input', async () => {
        await client.mutate({ mutation, variables });

        expect(pizzaProvider.updatePizza).toHaveBeenCalledWith(variables.input);
      });

      test('should return updated pizza', async () => {
        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          updatePizza: {
            __typename: 'Pizza',
            id: updatedPizza.id,
            name: updatedPizza.name,
            description: updatedPizza.description,
            imgSrc: updatedPizza.imgSrc,
            priceCents: updatedPizza.priceCents,
            toppings: updatedPizza.toppings,
          },
        });
      });
    });
  });
});
