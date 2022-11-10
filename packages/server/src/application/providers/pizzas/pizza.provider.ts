import { Collection, ObjectId } from 'mongodb';
import validateStringInputs from '../../../lib/string-validator';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import { CreatePizzaInput, Pizza } from './pizza.provider.types';
import { toppingProvider } from '..';

class PizzaProvider {
  constructor(private collection: Collection<PizzaDocument>) {}

  public async getPizzas(): Promise<Pizza[]> {
    const pizzas = await this.collection.find().sort({ name: 1 }).toArray();
    return pizzas.map(toPizzaObject);
  }

  public async createPizza(input: CreatePizzaInput): Promise<Pizza> {
    const { description, imgSrc, name, toppingIds } = input;
    await toppingProvider.validateToppings(toppingIds);

    if (description) validateStringInputs(description);
    if (imgSrc) validateStringInputs(imgSrc);
    if (name) validateStringInputs(name);
    if (toppingIds) validateStringInputs(toppingIds);

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId() },
      {
        $set: {
          ...(toppingIds && { toppingIds: toppingIds.map((toppingId) => new ObjectId(toppingId)) }),
          ...(name && { name }),
          ...(description && { description }),
          ...(imgSrc && { imgSrc }),
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
}

export { PizzaProvider };
