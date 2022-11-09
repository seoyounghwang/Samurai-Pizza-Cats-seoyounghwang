import { ListItemText } from '@material-ui/core';
import { Pizza } from '../../types';

export interface PizzaItemProps {
  pizza?: Pizza;
}

const PizzaItem: React.FC<PizzaItemProps> = ({ pizza, ...props }) => {
  return (
    <>
      <ListItemText primary={pizza?.name} />
      <ListItemText primary={pizza?.description} />
      <img src={pizza?.imgSrc} />
    </>
  );
};

export default PizzaItem;
