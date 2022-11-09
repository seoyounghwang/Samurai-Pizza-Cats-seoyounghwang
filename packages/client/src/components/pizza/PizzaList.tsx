import React from 'react';
import { useQuery } from '@apollo/client';
import { List, ListItem } from '@material-ui/core';
import { GET_PIZZAS } from '../../hooks/graphql/pizza/queries/get-pizzas';
import { Pizza } from '../../types/schema';
import CardItem from '../common/CardItem';
import CardItemSkeleton from '../common/CardItemSkeleton';
import PizzaItem from './PizzaItem';

const PizzaList: React.FC = () => {
  const { loading, data, error = loading === false && data === undefined ? true : false } = useQuery(GET_PIZZAS);

  if (error === true) {
    return <div>Error Occured</div>;
  }

  const pizzaList = data?.pizzas.map((pizza: Pizza) => (
    <ListItem>
      <CardItem key={pizza.id} children={<PizzaItem key={pizza.id} pizza={pizza} />} />
    </ListItem>
  ));

  if (loading) {
    return <CardItemSkeleton data-testid="pizza-list-loading" />;
  }

  return <List>{pizzaList}</List>;
};

export default PizzaList;
