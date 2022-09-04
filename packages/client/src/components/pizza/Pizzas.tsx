import React from 'react';
import { Container } from '@material-ui/core';

import PageHeader from '../common/PageHeader';

const Pizzas: React.FC = () => {
  return (
    <Container maxWidth="md">
      <PageHeader pageHeader={'Under construction'} />
      <img alt="under-construction" src="./codingcat.jpeg" />
    </Container>
  );
};

export default Pizzas;
