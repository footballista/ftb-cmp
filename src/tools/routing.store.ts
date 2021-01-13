import { createStore } from '@stencil/store';

const routes: { [key: string]: string } = {
  team: '/teams/:teamId/:teamName',
  game: '/games/:gameId/:gameTitle',
  season: '/seasons/:seasonId/:tournamentName',
  player: '/players/:playerId/:playerName',
  stadium: '/stadium/:stadiumId/:stadiumName',
  post: '/news/:postId/:postTitle',
};

export const routingStore = createStore({ routes }).state;
