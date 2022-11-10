import { ObjectId, Collection } from 'mongodb';
import { ToppingDocument, toToppingObject } from '../../../entities/topping';
import { CreateToppingInput, Topping, UpdateToppingInput } from './topping.provider.types';
import validateStringInputs from '../../../lib/string-validator';

class ToppingProvider {
  constructor(private collection: Collection<ToppingDocument>) {}

  public async getToppings(): Promise<Topping[]> {
    const toppings = await this.collection.find().sort({ name: 1 }).toArray();
    return toppings.map(toToppingObject);
  }

  public async getToppingsById(ids: string[]): Promise<Topping[]> {
    ids.map((id) => new ObjectId(id));
    const toppingsById = await this.collection
      .find({ _id: { $in: ids } })
      .sort({ name: 1 })
      .toArray();
    return toppingsById.map(toToppingObject);
  }

  public async getPriceCents(ids: string[]): Promise<number> {
    const sum = (await this.getToppingsById(ids)).reduce((prev, current) => prev + current.priceCents, 0);
    return sum;
  }

  public async validateToppings(ids: string[]): Promise<void> {
    ids.map((id) => new Object(id));
    const allToppingIds = (await this.getToppings()).map((toppings) => toppings.id);
    const result = ids.map((id) => allToppingIds.indexOf(id));
    const isValid = result.includes(-1) ? false : true;
    if (isValid == false) throw new Error(`toppings are not valid`);
  }

  public async createTopping(input: CreateToppingInput): Promise<Topping> {
    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId() },
      { $set: { ...input, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not create the ${input.name} topping`);
    }
    const topping = data.value;

    return toToppingObject(topping);
  }

  public async deleteTopping(id: string): Promise<string> {
    const toppingId = new ObjectId(id);

    const toppingData = await this.collection.findOneAndDelete({
      _id: toppingId,
    });

    const topping = toppingData.value;

    if (!topping) {
      throw new Error(`Could not delete the topping`);
    }

    return id;
  }

  public async updateTopping(input: UpdateToppingInput): Promise<Topping> {
    const { id, name, priceCents } = input;

    if (name) validateStringInputs(name);

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...(name && { name: name }), ...(priceCents && { priceCents: priceCents }) } },
      { returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not update the topping`);
    }
    const topping = data.value;

    return toToppingObject(topping);
  }
}

export { ToppingProvider };
