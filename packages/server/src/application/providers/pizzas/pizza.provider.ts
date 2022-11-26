import { Collection, ObjectId } from 'mongodb';
import validateStringInputs from '../../../lib/string-validator';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import {
  CreatePizzaInput,
  GetCursorResultsInput,
  GetPizzasResponse,
  Pizza,
  UpdatePizzaInput,
} from './pizza.provider.types';
import { ToppingProvider } from '../toppings/topping.provider';
import { CursorProvider } from './cursor.provider';
// import { pizzas } from 'scripts/initial-data';

class PizzaProvider {
  constructor(
    private collection: Collection<PizzaDocument>,
    private toppingProvider: ToppingProvider,
    private cursorProvider: CursorProvider
  ) {}

  /*   public async getPizzas(param: any): Promise<Pizza[]> {
    if(param) {
      const pizzas = await this.collection.find().sort({ name: 1 }).toArray();
      return {
        ...pizzas,
        totalCount: pizzas.length,
        hasNextPage: false,
        results: pizzas.map(toPizzaObject),
        cursor: null
      };
    } else {
      const {cursor, limit} = param.input;
      const {totalCount , hasNextPage, nextCursor, results} = await this.cursorProvider.getCursorResults({
        cursor,
        limit: limit ?? 10,
      });

    }

    return {
      ...pizzas,
      totalCount: totalCount,
      hasNextPage: hasNextPage,
      cursor: nextCursor,
      results: results.map(toPizzaObject),
    };
      
    
    // const pizzas = await this.collection.find().sort({ name: 1 }).toArray();
    // return pizzas.map(toPizzaObject);
  } */

  public async getPizzas(input: any): Promise<GetPizzasResponse> {
    // console.log(param);

    if (!input) {
      const data = await this.collection.find().sort({ name: 1 }).toArray();
      return {
        // ...data,
        totalCount: data.length,
        hasNextPage: false,
        results: data.map(toPizzaObject),
        cursor: null,
      };
    } else {
      const { cursor, limit, sort } = input;

      console.log(input);

      const { totalCount, hasNextPage, nextCursor, results } = await this.cursorProvider.getCursorResults({
        cursor,
        limit: limit ?? 10,
        sort,
      });

      return {
        totalCount: totalCount,
        hasNextPage: hasNextPage,
        cursor: nextCursor,
        results: results.map(toPizzaObject),
      };
    }
  }

  public async createPizza(input: CreatePizzaInput): Promise<Pizza> {
    const { description, imgSrc, name, toppingIds } = input;

    if (description) validateStringInputs(description);
    if (imgSrc) validateStringInputs(imgSrc);
    if (name) validateStringInputs(name);
    if (toppingIds) await this.toppingProvider.validateToppings(toppingIds);

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId() },
      {
        $set: {
          ...input,
          toppingIds: input.toppingIds?.map((id) => new ObjectId(id)),
          updateAt: new Date().toISOString(),
          createAt: new Date().toISOString(),
        },
      },

      { upsert: true, returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not create the ${input.name} pizza`);
    }
    const pizza = data.value;
    return toPizzaObject(pizza);
  }

  public async deletePizza(id: string): Promise<string> {
    const pizzaId = new ObjectId(id);

    const pizzaData = await this.collection.findOneAndDelete({
      _id: pizzaId,
    });

    const pizza = pizzaData.value;

    if (!pizza) {
      throw new Error(`Could not delete the pizza`);
    }
    return id;
  }

  public async updatePizza(input: UpdatePizzaInput): Promise<Pizza> {
    const { id, description, imgSrc, name, toppingIds } = input;

    if (description) validateStringInputs(description);
    if (imgSrc) validateStringInputs(imgSrc);
    if (name) validateStringInputs(name);
    toppingIds && (await this.toppingProvider.validateToppings(toppingIds));

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(toppingIds && { toppingIds: toppingIds.map((toppingId) => new ObjectId(toppingId)) }),
          ...(name && { name }),
          ...(description && { description }),
          ...(imgSrc && { imgSrc }),
          updateAt: new Date().toISOString(),
        },
      },

      { returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not update the pizza`);
    }

    const pizza = data.value;

    return toPizzaObject(pizza);
  }
}

export { PizzaProvider };
