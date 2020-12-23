import { createStore } from '@stencil/store';
import { GraphqlClient } from 'ftb-models/dist/tools/clients/graphql.client';
import { HttpClient } from 'ftb-models/dist/tools/clients/http.client';
import { User } from 'ftb-models';

export const diStore = createStore({
  gql: new GraphqlClient(new HttpClient('AFL_RU', new User()), 'http://localhost:3004/grapqhl'),
}).state;
