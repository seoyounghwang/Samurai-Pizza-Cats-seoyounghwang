import { IconButton, ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core';
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
        <ListItem {...props} onClick={(): void => handleOpen(pizza)} className={classes.root}>
          <ListItemText primary={pizza?.name} />
          <ListItemText primary={pizza?.description} />
          <ListItemText primary={pizza?.priceCents ? toDollars(pizza.priceCents) : ''} />
          <img src={pizza?.imgSrc} />
        </ListItem>
      ) : (
        <ListItem>
          <p>Add Pizza</p>
          <img src={createPizzaImage} alt="make-pizza-cat" className={classes.img} />
          <IconButton edge="end" aria-label="modify" type="button" onClick={(): void => handleOpen(pizza)}>
            <AddCircle />
          </IconButton>
        </ListItem>
      )}
    </>
  );
};

export default PizzaItem;
