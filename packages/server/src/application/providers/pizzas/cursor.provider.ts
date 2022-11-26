// import { QueryResult } from "@apollo/client";
import { Collection, ObjectId } from 'mongodb';
import { PizzaDocument } from '../../../entities/pizza';
import { GetCursorResultsInput } from './pizza.provider.types';
//23

import { toPizzaObject } from 'src/entities/pizza';
// import { ToppingProvider } from "../toppings/topping.provider";
import { QueryResult } from '@apollo/client';

class CursorProvider {
  constructor(
    private collection: Collection<PizzaDocument> // private toppingProvider: ToppingProvider, // private cursorProvider: CursorProvider
  ) {}

  public async getCursorIndex(cursor: string | null): Promise<number> {
    console.log('inside cursor.provider.');
    console.log('cursor: ' + cursor);
    if (cursor === null) return -1;

    const pizzas = await this.collection.find().sort({ name: 1 }).toArray();

    console.log('pizzas: ' + pizzas.map((pizza) => pizza.name));

    return pizzas.findIndex((element) => cursor === element._id.toHexString());
  }

  //   public async getCursorResults({ limit, cursor }: GetCursorResultsInput): Promise<any> {
  public async getCursorResults(input: any): Promise<any> {
    let { cursor, limit } = input;
    let hasNextPage = false;
    // cursor &&
    const itemsToSkip = await this.getCursorIndex(cursor);
    // toppingIds && (await this.toppingProvider.validateToppings(toppingIds));

    // itemsToSkip && limit &&
    if (limit === null) limit = 0;
    const mongoDocuments = await this.collection
      .find()
      .skip(itemsToSkip)
      .limit(limit + 1)
      .toArray();

    if (mongoDocuments.length > limit) {
      hasNextPage = true;
      mongoDocuments.pop();
    }
    const nextCursor = mongoDocuments.length < limit ? null : mongoDocuments[limit - 1]._id;
    return {
      totalCount: mongoDocuments.length,
      hasNextPage,
      nextCursor,
      results: mongoDocuments,
    };
  }
}
export { CursorProvider };

//   public async getPizzas(args: any): Promise<GetPizzasResponse> {
//     if (!args) {
//       const data = await this.collection.find().sort({ name: 1 }).toArray();
//       return {
//         totalCount: data.length,
//         hasNextPage: false,
//         results: data.map(toPizzaObject),
//         cursor: null,
//       };
//     } else {
//       const { cursor, limit } = args.input;

//       const { totalCount, hasNextPage, nextCursor, results } = await this.getCursorResults({
//           cursor,
//         limit: limit ?? 6,
//       });

//       return {
//         totalCount: totalCount,
//         hasNextPage: hasNextPage,
//         cursor: nextCursor,
//         results: results.map(toPizzaObject),
//       };
//     }
//   }
// }

/*   public async getCursorResults(args: any): Promise<any> {
    const { cursor, limit } = args;

    const nextIndex = 1 + (await this.getCursorIndex(cursor));
    const data = await this.collection.find().sort({ name: 1 }).skip(nextIndex).toArray();

    const hasNextPage = data.length > limit ? true : false;

    const currentLimit = hasNextPage ? limit : data.length;
    const results = hasNextPage ? data.slice(0, currentLimit) : data;
    const nextCursor = hasNextPage ? results[currentLimit - 1]._id.toHexString() : null;

    return {
      totalCount: currentLimit,
      hasNextPage: hasNextPage,
      nextCursor: nextCursor,
      results: results,
    };
  } */
