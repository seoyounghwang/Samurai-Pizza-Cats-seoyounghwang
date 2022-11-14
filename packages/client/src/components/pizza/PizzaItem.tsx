import { ListItem, ListItemText } from '@material-ui/core';
import toDollars from '../../lib/format-dollars';
import { Pizza } from '../../types';

export interface PizzaItemProps {
  pizza?: Pizza;
}

const PizzaItem: React.FC<PizzaItemProps> = ({ pizza, ...props }) => {
  return (
    <ListItem {...props}>
      <ListItemText primary={pizza?.name} />
      <ListItemText primary={pizza?.description} />
      <ListItemText primary={pizza?.priceCents ? toDollars(pizza.priceCents) : ''} />
      <img src={pizza?.imgSrc} />
    </ListItem>
  );
};

export default PizzaItem;
