import React from 'react';
import { useQuery } from '@apollo/client';
import { Container, Grid } from '@material-ui/core';
import { GET_PIZZAS } from '../../hooks/graphql/pizza/queries/get-pizzas';
import { Pizza, Topping } from '../../types';
import CardItemSkeleton from '../common/CardItemSkeleton';
import PizzaItem from './PizzaItem';
import PizzaModal from './PizzaModal';
import PageHeader from '../common/PageHeader';

const PizzaList: React.FC = () => {
  const [limit, setLimit] = React.useState(5);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const {
    loading,
    data,
    error = loading === false && data === undefined ? true : false,
  } = useQuery(GET_PIZZAS, {
    variables: {
      input: {
        cursor: 'default',
        limit,
      },
    },
  });

  const onClickBtn = (): void => {
    console.log(data?.pizzaResults.results.length);
    setLimit((current) => current + 3);
    if (limit > data?.pizzaResults.results.length) setHasNextPage(false);
  };

  const [selectedPizza, setSeletedPizza] = React.useState<Partial<Pizza>>();
  const [open, setOpen] = React.useState(false);
  const [toppings, setToppings] = React.useState<Topping[]>([]);

  React.useEffect(() => {}, [limit]);

  if (error === true) {
    return <div>Error Occured</div>;
  }

  const handleOpen = (pizza?: Pizza): void => {
    setSeletedPizza(pizza);
    setOpen(true);
  };

  const pizzaList = data?.pizzaResults.results.map((pizza: Pizza) => (
    <Grid item xs={12} sm={6} lg={4} key={pizza.id}>
      <PizzaItem data-testid={`pizza-item-${pizza?.id}`} key={pizza.id} pizza={pizza} handleOpen={handleOpen} />
    </Grid>
  ));

  if (loading) {
    return <CardItemSkeleton data-testid="pizza-list-loading" />;
  }

  return (
    <Container>
      <div data-testid={`pizza-item-test`}></div>
      <PageHeader pageHeader={'Pizzas'} />
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4} lg={4} key="add-pizza">
          <PizzaItem key="add-pizza" handleOpen={handleOpen} />
        </Grid>
        {pizzaList}
      </Grid>
      <PizzaModal
        selectedPizza={selectedPizza}
        setSelectedPizza={setSeletedPizza}
        open={open}
        setOpen={setOpen}
        toppings={toppings}
        setToppings={setToppings}
      />
      {hasNextPage ? <button onClick={onClickBtn}>see more pizzas...</button> : null}
    </Container>
  );
};

export default PizzaList;
