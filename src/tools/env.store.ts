import { createStore } from '@stencil/store';

export const envStore = createStore({
  appKey: 'AFL_RU',
  graphqlHost: 'http://localhost:3004/grapqhl',
  apiHost: 'http://localhost:3001/api',
  imgHost: 'https://footballista.ru/api/',
}).state;
