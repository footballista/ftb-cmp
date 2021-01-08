import { Component, Host, h, Prop } from '@stencil/core';
import { Season } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
import { SeasonService } from 'ftb-models/dist/services/season.service';
import { diStore } from '@src/tools/di.store';
@Component({
  tag: 'ftb-season-best-players',
  styleUrl: 'ftb-season-best-players.component.scss',
  shadow: true,
})
export class FtbSeasonBestPlayers {
  @Prop() season!: Season;
  ready$ = new AsyncSubject<boolean>();

  componentWillLoad() {
    new SeasonService(diStore.gql);
    // new SeasonService(diStore.gql).loadPlayersStats(this.season._id).then(s => {
    //   this.season.players;
    // });
  }

  render() {
    return <Host>Season best players</Host>;
  }
}
