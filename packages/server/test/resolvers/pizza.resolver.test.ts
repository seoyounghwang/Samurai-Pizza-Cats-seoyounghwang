import { gql } from 'apollo-server-core';
import { pizzaProvider, toppingProvider } from '../../src/application/providers';
import { pizzaResolver } from '../../src/application/resolvers/pizza.resolver';
import { typeDefs } from '../../src/application/schema/index';
import {
  MutationCreatePizzaArgs,
  MutationDeletePizzaArgs,
  MutationUpdatePizzaArgs,
} from '../../src/application/schema/types/schema';
import { createMockPizza, createMockPizzaDocument } from '../helpers/pizza.helper';
import { TestClient } from '../helpers/client.helper';
import { createMockTopping } from '../helpers/topping.helper';
// import { toPizzaObject } from 'src/entities/pizza';
// import { ObjectId } from 'mongodb';

let client: TestClient;

jest.mock('../../src/application/database', () => ({
  setupDb: (): any => ({ collection: (): any => jest.fn() }),
}));

const mockPizza = createMockPizza();
//test code
// const mockPizzaDocument = createMockPizzaDocument();
const mockTopping = createMockTopping();

//test code
// const pizzaInputData = {
//   name: 'Test Pizza',
//   description: 'test Pizza description',
//   imgSrc: 'testImg',
//   toppingIds: ['19651dda4a0af8315d840412', 'e9e565e9a57cf33fb9b8ceed'],
// };

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
        query getPizzas {
          pizzas {
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
      test('should get all pizzas', async () => {
        // const mockProviderPizza = {
        //   __typename: 'Pizza',
        //   id: mockPizzaDocument._id,
        //   name: mockPizzaDocument.name,
        //   description: mockPizzaDocument.description,
        //   toppingIds: mockPizzaDocument.toppingIds,
        //   imgSrc: mockPizzaDocument.imgSrc,
        // };

        // jest.spyOn(pizzaProvider, 'getPizzas').mockResolvedValue([mockProviderPizza]);

        jest
          .spyOn(pizzaProvider, 'getPizzas')
          .mockResolvedValue([{ ...mockPizza, toppingIds: mockPizza.toppings.map((topping) => topping.id) }]);
        jest.spyOn(toppingProvider, 'getToppingsById').mockResolvedValue([mockTopping]);
        jest.spyOn(toppingProvider, 'getPriceCents').mockResolvedValue(mockPizza.priceCents);

        const result = await client.query({ query });

        expect(result.data).toEqual({
          pizzas: [
            {
              __typename: 'Pizza',
              id: mockPizza.id,
              name: mockPizza.name,
              description: mockPizza.description,
              imgSrc: mockPizza.imgSrc,
              priceCents: mockPizza.priceCents,
              toppings: [],
              // added
              // toppingIds: mockPizza.toppingIds,
            },
          ],
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
        // added
        // toppingIds: [],
      });

      /**
       * __typename: 'Pizza',
    id: new ObjectID().toHexString(),
    name: 'Lovey',
    description: 'Jest pizza',
    imgSrc: 'http://cm1.narvii.com/6874/bcc63b6b6fa12d68d8b0a8488de55282d701df4c_00.jpg',
    priceCents: 700,
    toppings: [],
    ...data,
       */

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
            toppingIds: validPizza.toppings.map((topping) => topping.id),
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
            // toppingIds: validPizza.toppings.map((topping) => topping.id),
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

      // test code
      // const updatePizza = {
      //   id: mockPizzaDocument._id,
      //   name: 'update pizza',
      //   description: 'update Pizza description',
      //   imgSrc: 'updateImg',
      //   toppingIds: [new ObjectId('19651dda4a0af8315d840412'), new ObjectId('e9e565e9a57cf33fb9b8ceed')],
      // };

      // const variables: MutationUpdatePizzaArgs = { input: updatePizza };

      const updatedPizza = createMockPizza({
        name: 'updated pizza',
        description: 'test updated pizza',
        imgSrc: 'updatedImg',
        // toppingIds: [],
        toppings: [],
        priceCents: 500,
      });

      const variables: MutationUpdatePizzaArgs = {
        input: {
          // updatePizza
          id: mockPizza.id,
          name: updatedPizza.name,
          description: updatedPizza.description,
          imgSrc: updatedPizza.imgSrc,
          toppingIds: updatedPizza.toppings.map((topping) => topping.id),
          // toppings: updatedPizza.toppings,
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

        /**
         * __typename: 'Pizza',
              id: mockPizza.id,
              name: mockPizza.name,
              description: mockPizza.description,
              imgSrc: mockPizza.imgSrc,
              priceCents: mockPizza.priceCents,
              toppings: mockPizza.toppings,
         */
        expect(result.data).toEqual({
          updatePizza: {
            __typename: 'Pizza',
            id: updatedPizza.id,
            name: updatedPizza.name,
            description: updatedPizza.description,
            imgSrc: updatedPizza.imgSrc,
            priceCents: updatedPizza.priceCents,
            toppings: updatedPizza.toppings,
            // added
            // toppingIds: updatedPizza.toppingIds,
          },
        });
      });
    });
  });
});
