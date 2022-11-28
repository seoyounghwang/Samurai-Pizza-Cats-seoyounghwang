// import { QueryResult } from "@apollo/client";
import { Collection, ObjectId } from 'mongodb';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import { CursorInput, GetPizzasResponse } from './pizza.provider.types';
//23

// import { toPizzaObject } from 'src/entities/pizza';
// import { ToppingProvider } from "../toppings/topping.provider";
import { QueryResult } from '@apollo/client';
import { pizzaProvider } from '..';

class CursorProvider {
  constructor(private collection: Collection<PizzaDocument>) {}

  public async getCursorIndex(cursor: string): Promise<number> {
    if (cursor === null) return -1;

    const pizzas = await this.collection.find().sort({ name: 1 }).toArray();

    return pizzas.findIndex((element) => cursor === element._id.toHexString());
  }

  public async getCursorResults({ limit, cursor, sort }: CursorInput): Promise<any> {
    let hasNextPage = false;
    const itemsToSkip = await this.getCursorIndex(cursor);
    const mongoDocuments = await this.collection
      .find()
      .sort({ name: 1 })
      .skip(itemsToSkip)
      .limit(limit + 1)
      .toArray();

    if (mongoDocuments.length > limit) {
      hasNextPage = true;
      mongoDocuments.pop();
    }
    const nextCursor = mongoDocuments.length < limit ? null : mongoDocuments[limit - 1]?._id;
    return {
      totalCount: mongoDocuments.length,
      hasNextPage,
      cursor: nextCursor,
      results: mongoDocuments.map(toPizzaObject),
    };
  }
}
export { CursorProvider };
