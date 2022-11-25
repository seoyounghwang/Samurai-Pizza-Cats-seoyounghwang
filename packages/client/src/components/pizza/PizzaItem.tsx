import { Button, IconButton, makeStyles, Theme } from '@material-ui/core';
import toDollars from '../../lib/format-dollars';
import { Pizza } from '../../types';
import createPizzaImage from '../../assets/img/make-pizza.jpeg';
import { AddCircle } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: theme.typography.pxToRem(400),
  },
  img: {
    width: theme.typography.pxToRem(350),
    height: theme.typography.pxToRem(350),
  },
}));

export interface PizzaItemProps {
  pizza?: Pizza;
  handleOpen: (pizza?: Pizza) => void;
}

const PizzaItem: React.FC<PizzaItemProps> = ({ pizza, handleOpen, ...props }) => {
  const classes = useStyles();
  return (
    <>
      {pizza?.name ? (
        <Button variant="text" type="button" onClick={(): void => handleOpen(pizza)} className={classes.root}>
          <div {...props}>
            <p data-testid={`pizza-name-${pizza?.id}`}>{pizza?.name}</p>
            <p data-testid={`pizza-description-${pizza?.id}`}>{pizza?.description}</p>
            <p data-testid={`pizza-priceCents-${pizza?.id}`}>{pizza?.priceCents ? toDollars(pizza.priceCents) : ''}</p>
            <img src={pizza?.imgSrc} data-testid={`pizza-imgSrc-${pizza?.id}`} />
          </div>
        </Button>
      ) : (
        <div>
          <p>Add Pizza</p>
          <img src={createPizzaImage} alt="make-pizza-cat" className={classes.img} />
          <IconButton edge="end" aria-label="modify" type="button" onClick={(): void => handleOpen(pizza)}>
            <AddCircle />
          </IconButton>
        </div>
      )}
    </>
  );
};

export default PizzaItem;
