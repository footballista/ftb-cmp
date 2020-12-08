import { createStore } from '@stencil/store';
import { User } from 'ftb-models/dist/models/user.model';

const { state } = createStore({
  user: new User()
});
export default state;
