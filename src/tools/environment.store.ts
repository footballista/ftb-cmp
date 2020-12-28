import { createStore } from '@stencil/store';

export const environmentStore = createStore({
  appKey: 'AFL_RU',
  graphqlHost: 'http://localhost:3004/grapqhl',
  apiHost: 'https://footballista.ru/api',
  photoHost: 'https://footballista.ru/api',
  localHost: 'http://localhost:3333',
}).state;
