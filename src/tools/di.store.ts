import { createStore } from '@stencil/store';
import { GraphqlClient } from 'ftb-models/dist/tools/clients/graphql.client';
import { HttpClient } from 'ftb-models/dist/tools/clients/http.client';
import userState from '@src/tools/user.store';
import { envStore } from '@src/tools/env.store';

export const diStore = createStore({
  gql: new GraphqlClient(new HttpClient(envStore.appKey, userState), envStore.graphqlHost),
  http: new HttpClient(envStore.appKey, userState),
}).state;
