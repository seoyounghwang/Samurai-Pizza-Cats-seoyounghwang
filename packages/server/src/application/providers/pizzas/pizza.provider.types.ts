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

export interface GetCursorResultsInput {
  cursor: string | null;
  limit: number | null;
  sort: number | null;
}

export interface GetPizzasResponse {
  results: Pizza[];
  totalCount: number;
  hasNextPage: boolean;
  cursor: string | null;
}
