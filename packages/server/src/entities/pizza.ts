import { Document, ObjectId } from 'mongodb';
import { Pizza } from '../application/providers/pizzas/pizza.provider.types';

// interface PizzaDocument extends Document, Omit<Pizza, 'id'> {}
interface PizzaDocument extends Document, Omit<Pizza, 'toppingIds' | 'id'> {
  toppingIds: ObjectId[];
}

const toPizzaObject = (pizza: PizzaDocument): Pizza => {
  return {
    id: pizza._id.toHexString(),
    name: pizza.name,
    description: pizza.description,
    imgSrc: pizza.imgSrc,
    toppingIds: pizza.toppingIds,
    toppings: pizza.toppings,
    priceCents: pizza.priceCents,
  };
};

export { PizzaDocument, toPizzaObject };
