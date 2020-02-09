import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Main from './Main';
import Box from './Box';

const Routes = createAppContainer(
  createSwitchNavigator({
    Main,
    Box
  })
);

export default Routes;
