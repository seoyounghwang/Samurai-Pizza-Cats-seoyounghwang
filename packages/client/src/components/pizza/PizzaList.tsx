import React from 'react';
import { useQuery } from '@apollo/client';
import { Container, List, ListItem } from '@material-ui/core';
import { GET_PIZZAS } from '../../hooks/graphql/pizza/queries/get-pizzas';
import { Pizza, Topping } from '../../types';
import CardItem from '../common/CardItem';
import CardItemSkeleton from '../common/CardItemSkeleton';
import PizzaItem from './PizzaItem';
import PizzaModal from './PizzaModal';
import PageHeader from '../common/PageHeader';

const PizzaList: React.FC = () => {
  const { loading, data, error = loading === false && data === undefined ? true : false } = useQuery(GET_PIZZAS);

  const [selectedPizza, setSeletedPizza] = React.useState<Partial<Pizza>>();
  const [open, setOpen] = React.useState(false);
  const [toppings, setToppings] = React.useState<Topping[]>([]);

  if (error === true) {
    return <div>Error Occured</div>;
  }

  const handleOpen = (pizza?: Pizza): void => {
    console.log('select pizza function');
    console.log(pizza);
    setSeletedPizza(pizza);
    // setToppings(topping_data?.toppings);
    setOpen(true);
  };

  const pizzaList = data?.pizzas.map((pizza: Pizza) => (
    <ListItem>
      <CardItem key={pizza.id} children={<PizzaItem key={pizza.id} pizza={pizza} handleOpen={handleOpen} />} />
    </ListItem>
  ));

  if (loading) {
    return <CardItemSkeleton data-testid="pizza-list-loading" />;
  }

  return (
    <Container maxWidth="md">
      <PageHeader pageHeader={'Pizzas'} />
      <List>
        <ListItem>
          <CardItem key="add-pizza" children={<PizzaItem key="add-pizza" handleOpen={handleOpen} />} />
        </ListItem>
        {pizzaList}
      </List>
      <PizzaModal
        selectedPizza={selectedPizza}
        setSelectedPizza={setSeletedPizza}
        open={open}
        setOpen={setOpen}
        toppings={toppings}
        setToppings={setToppings}
      />
    </Container>
  );
};

export default PizzaList;
