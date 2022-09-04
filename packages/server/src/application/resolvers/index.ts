import { merge } from 'lodash';

import { toppingResolver } from './topping.resolver';

const resolvers = merge(toppingResolver);

export { resolvers };
