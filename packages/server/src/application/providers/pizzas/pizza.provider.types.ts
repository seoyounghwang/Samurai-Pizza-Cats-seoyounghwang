import { ObjectId } from 'mongodb';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppingIds: ObjectId[];
  imgSrc: string;
}

export interface CreatePizzaInput {
  name: string;
  description: string;
  imgSrc?: string | null;
  toppingIds: string[];
}

export interface UpdatePizzaInput {
  id: string;
  name?: string | null;
  description?: string | null;
  imgSrc?: string | null;
  toppingIds?: string[] | null;
}
