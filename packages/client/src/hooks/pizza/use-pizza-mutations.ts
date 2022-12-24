import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { CREATE_PIZZA } from '../graphql/pizza/mutations/create-pizza';
import { DELETE_PIZZA } from '../graphql/pizza/mutations/delete-pizza';
import { UPDATE_PIZZA } from '../graphql/pizza/mutations/update-pizza';
import { GET_PIZZAS } from '../graphql/pizza/queries/get-pizzas';

interface UsePizzaMutationsOutput {
  onCreatePizza: (selectedPizza: any) => void;
  onDeletePizza: (selectedPizza: any) => Promise<void>;
  onUpdatePizza: (selectedPizza: any) => void;
}

const usePizzaMutations = (): UsePizzaMutationsOutput => {
  const [createPizza] = useMutation(CREATE_PIZZA, { refetchQueries: [GET_PIZZAS, 'PizzaResults'] });
  const [deletePizza] = useMutation(DELETE_PIZZA, { refetchQueries: [GET_PIZZAS, 'PizzaResults'] });
  const [updatePizza] = useMutation(UPDATE_PIZZA);

  const onCreatePizza = useCallback(
    (selectedPizza) => {
      console.log('createpizza in');
      console.log(selectedPizza);
      try {
        createPizza({
          variables: {
            createPizzaInput: {
              name: selectedPizza.name,
              description: selectedPizza.description,
              imgSrc: selectedPizza.imgSrc,
              toppingIds: selectedPizza.toppingIds,
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [createPizza]
  );

  const onDeletePizza = useCallback(
    async (selectedPizza) => {
      try {
        await deletePizza({
          variables: {
            deletePizzaInput: {
              id: selectedPizza.id,
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [deletePizza]
  );

  const onUpdatePizza = useCallback(
    (selectedPizza) => {
      try {
        updatePizza({
          variables: {
            updatePizzaInput: {
              id: selectedPizza.id,
              name: selectedPizza?.name,
              description: selectedPizza?.description,
              imgSrc: selectedPizza?.imgSrc,
              toppingIds: selectedPizza?.toppingIds,
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [updatePizza]
  );
  return { onCreatePizza, onDeletePizza, onUpdatePizza };
};

export default usePizzaMutations;
