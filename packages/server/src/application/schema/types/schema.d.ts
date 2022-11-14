export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Long: any;
  ObjectID: any;
};

export type CreateToppingInput = {
  name: Scalars['String'];
  priceCents: Scalars['Int'];
};

export type DeleteToppingInput = {
  id: Scalars['ObjectID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTopping: Topping;
  deleteTopping: Scalars['ObjectID'];
  updateTopping: Topping;
};

export type MutationCreateToppingArgs = {
  input: CreateToppingInput;
};

export type MutationDeleteToppingArgs = {
  input: DeleteToppingInput;
};

export type MutationUpdateToppingArgs = {
  input: UpdateToppingInput;
};

export type Pizza = {
  __typename?: 'Pizza';
  description: Scalars['String'];
  id: Scalars['ObjectID'];
  imgSrc: Scalars['String'];
  name: Scalars['String'];
  priceCents: Scalars['Float'];
  toppingIds: Array<Scalars['String']>;
  toppings: Array<Topping>;
};

export type PizzaQueryArgs = {
  __typename?: 'PizzaQueryArgs';
  id: Scalars['ObjectID'];
};

export type Query = {
  __typename?: 'Query';
  pizzas: Array<Pizza>;
  toppings: Array<Topping>;
};

export type Topping = {
  __typename?: 'Topping';
  id: Scalars['ObjectID'];
  name: Scalars['String'];
  priceCents: Scalars['Int'];
};

export type ToppingQueryArgs = {
  id: Scalars['ObjectID'];
};

export type UpdateToppingInput = {
  id: Scalars['ObjectID'];
  name?: InputMaybe<Scalars['String']>;
  priceCents?: InputMaybe<Scalars['Int']>;
};
