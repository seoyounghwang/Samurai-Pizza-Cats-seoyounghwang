import { Collection, ObjectId } from 'mongodb';
import validateStringInputs from '../../../lib/string-validator';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import { CreatePizzaInput, Pizza, UpdatePizzaInput } from './pizza.provider.types';
// import { toppingProvider } from '..';
import { ToppingProvider } from '../toppings/topping.provider';

class PizzaProvider {
  constructor(private collection: Collection<PizzaDocument>, private toppingProvider: ToppingProvider) {}

  public async getPizzas(): Promise<Pizza[]> {
    const pizzas = await this.collection.find().sort({ name: 1 }).toArray();
    return pizzas.map(toPizzaObject);
  }

  public async createPizza(input: CreatePizzaInput): Promise<Pizza> {
    const { description, imgSrc, name, toppingIds } = input;

    if (description) validateStringInputs(description);
    if (imgSrc) validateStringInputs(imgSrc);
    if (name) validateStringInputs(name);
    // toppingIds.map((toppingId) => new ObjectId(toppingId));
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
    // if (toppingIds) validateStringInputs(toppingIds);
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
