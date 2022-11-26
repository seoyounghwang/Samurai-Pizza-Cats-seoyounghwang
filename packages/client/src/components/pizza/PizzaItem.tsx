import { Button, Card, CardContent, IconButton, makeStyles, Theme } from '@material-ui/core';
import toDollars from '../../lib/format-dollars';
import { Pizza } from '../../types';
import createPizzaImage from '../../assets/img/make-pizza.jpeg';
import { AddCircle } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: theme.typography.pxToRem(400),
    paddingTop: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
  },
  addPizza: {
    background: '#000000',
  },
  img: {
    width: theme.typography.pxToRem(350),
    height: theme.typography.pxToRem(350),
    objectFit: 'cover',
  },

  newPizzaContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'black',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    position: 'relative',
  },

  newPizzaDiv: {
    display: 'flex',
    flexDirection: 'column',
  },

  newPizzaTitle: {
    color: 'white',
    paddingTop: '20px',
    flex: '1',
  },

  addButton: {
    alignItems: 'center',
    textAlign: 'center',
    // paddingBottom: '10px',
    fontSize: '50px',
    flex: '8',
    color: 'white',
    transition: '0.3s',
    cursor: 'pointer',
    '&:hover': {
      color: 'grey',
    },
  },

  cardContent: {
    paddingTop: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
    marginTop: '0px',
  },

  cardButton: {
    boxShadow: '0px',
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
      <Card className={classes.root}>
        {pizza?.name ? (
          <Button
            variant="text"
            type="button"
            onClick={(): void => handleOpen(pizza)}
            className={classes.cardButton}
            disableElevation
          >
            <CardContent>
              <div {...props}>
                <img src={pizza?.imgSrc} className={classes.img} data-testid={`pizza-imgSrc-${pizza?.id}`} />
                <h2 data-testid={`pizza-name-${pizza?.id}`}>{pizza?.name}</h2>
                <p data-testid={`pizza-description-${pizza?.id}`}>{pizza?.description}</p>
                <p data-testid={`pizza-priceCents-${pizza?.id}`}>
                  {pizza?.priceCents ? toDollars(pizza.priceCents) : ''}
                </p>
              </div>
            </CardContent>
          </Button>
        ) : (
          <CardContent className={`${classes.cardContent} ${classes.newPizzaContainer}`}>
            <div className={classes.newPizzaDiv}>
              <h1 className={classes.newPizzaTitle}>Make a New Pizza</h1>
              <img src={createPizzaImage} alt="make-pizza-cat" className={classes.img} />
              <IconButton edge="end" aria-label="modify" type="button" onClick={(): void => handleOpen(pizza)}>
                <AddCircle className={classes.addButton} />
              </IconButton>
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default PizzaItem;
