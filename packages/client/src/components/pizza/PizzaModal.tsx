import {
  Backdrop,
  createStyles,
  Fade,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  TextField,
  Select,
  Theme,
  useTheme,
  Button,
  FormControl,
} from '@material-ui/core';
import React from 'react';
import usePizzaMutations from '../../hooks/pizza/use-pizza-mutations';
import defaultPizzaImage from '../../assets/img/default-pizza.jpeg';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useQuery } from '@apollo/client';
import { GET_TOPPINGS } from '../../hooks/graphql/topping/queries/get-toppings';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  imgurl: yup.string().required('Img url is required'),
  toppings: yup.array().required('Topping(s) is/are required'),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      width: theme.typography.pxToRem(400),
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    img: {
      display: 'flex',
      width: theme.typography.pxToRem(350),
      height: theme.typography.pxToRem(350),
    },
  })
);

interface PizzaModalProps {
  toppings?: any[];
  setToppings: React.Dispatch<React.SetStateAction<any[]>>;
  selectedPizza?: any;
  setSelectedPizza: React.Dispatch<React.SetStateAction<any>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const getStyles = (name: string, theme: Theme, toppings?: any[]): any => {
  return {
    fontWeight:
      toppings?.map((topping) => topping.name).indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

// toppingList
const PizzaModal = ({
  toppings,
  setToppings,
  selectedPizza,
  setSelectedPizza,
  open,
  setOpen,
}: PizzaModalProps): JSX.Element => {
  const { data: topping_data } = useQuery(GET_TOPPINGS);
  const toppingList = topping_data?.toppings;

  const formik = useFormik({
    initialValues: {
      id: selectedPizza?.id,
      name: selectedPizza?.name,
      description: selectedPizza?.description,
      imgSrc: selectedPizza?.imgSrc,
      toppings: selectedPizza?.toppings,
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      const { name, description, imgSrc, toppings } = values;

      let newPizza = {
        // ...values,
        name: name,
        description: description,
        imgSrc: imgSrc ? imgSrc : '',
        toppingIds: toppings,
      };
      // console.log(values);
      // console.log(newPizza);

      selectedPizza?.id ? onUpdatePizza({ ...newPizza, id: selectedPizza.id }) : onCreatePizza(newPizza);

      setOpen(false);
    },
  });
  const classes = useStyles();
  const theme = useTheme();

  const { onCreatePizza, onDeletePizza, onUpdatePizza } = usePizzaMutations();

  const handleChange = (event: any): void => {
    const {
      target: { value },
    } = event;
    setToppings(typeof value === 'string' ? value.split(',').toString() : value);
    formik.values.toppings = value;
  };

  return (
    <Modal
      className={classes.modal}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={(): void => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper className={classes.paper}>
          {selectedPizza?.name ? <h2 className={classes.title}>{selectedPizza?.name}</h2> : <></>}
          <form className={classes.root} onSubmit={formik.handleSubmit} autoComplete="off">
            <img
              src={selectedPizza?.imgSrc ? selectedPizza?.imgSrc : defaultPizzaImage}
              alt="create-pizza-image"
              className={classes.img}
            />
            <h2>Details</h2>
            <InputLabel>Name: </InputLabel>
            <TextField
              id="name-input"
              name="name"
              placeholder="Name"
              defaultValue={selectedPizza?.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth={true}
              variant="standard"
            />

            <InputLabel>Description: </InputLabel>
            <TextField
              id="description-input"
              name="description"
              placeholder="Description"
              defaultValue={selectedPizza?.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              fullWidth={true}
              variant="standard"
            />

            <InputLabel>Image URL </InputLabel>
            <TextField
              id="imageurl-input"
              name="imgSrc"
              placeholder="Image Url"
              defaultValue={selectedPizza?.imgSrc}
              onChange={formik.handleChange}
              fullWidth={true}
              variant="standard"
            />
            <h2>Toppings</h2>
            <FormControl fullWidth variant="standard">
              <Select
                id="topping-input"
                style={{ minWidth: 200 }}
                multiple
                value={toppings}
                defaultValue={selectedPizza?.toppings.map((topping: any) => topping.name)}
                input={<OutlinedInput label="Toppings" />}
                error={formik.touched.toppings && Boolean(formik.errors.toppings)}
                onChange={(e): void => {
                  handleChange(e);
                }}
              >
                {toppingList?.map((topping: any) => (
                  <MenuItem key={topping?.id} value={topping?.id} style={getStyles(topping?.name, theme, toppings)}>
                    {topping?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br />
            <Button type="submit">Submit</Button>
            {selectedPizza?.name ? (
              <Button
                onClick={(): void => {
                  onDeletePizza(selectedPizza);
                  setOpen(false);
                }}
              >
                Delete
              </Button>
            ) : null}
          </form>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default PizzaModal;
