import { Component, Host, h, Prop } from '@stencil/core';
import { filter, League, translations } from 'ftb-models';
import userState from '@src/tools/user.store';
import { Team } from 'ftb-models/dist/models/team.model';
import { AsyncSubject } from 'rxjs';
import { LeagueService } from 'ftb-models/dist/services/league.service';
import orderBy from 'lodash-es/orderBy';
import { diStore } from '@src/tools/di.store';

@Component({
  tag: 'ftb-league-teams',
  styleUrl: 'ftb-league-teams.component.scss',
  shadow: false,
})
export class FtbLeagueTeams {
  @Prop() league!: League;
  private ready$ = new AsyncSubject<boolean>();

  componentWillLoad() {
    new LeagueService(diStore.gql).loadLeagueTeams(this.league._id).then(l => {
      l.teams.items = orderBy(l.teams.items, ['rating'], ['desc']);
      this.league.teams = l.teams;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-league-teams__wrapper">
          <div class="ftb-league-teams__background">
            <h2 class="component-header">{translations.team.teams[userState.language]}</h2>
            <div class="ftb-league-teams__content">{this.renderTeamsList()}</div>
          </div>
        </div>
      </Host>
    );
  }

  private renderTeamsList() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      if (!query) return this.league.teams.items;
      await this.ready$.toPromise();
      filtersOn = Boolean(query);
      return filter(this.league.teams.items, query, ['name']);
    };

    return (
      <ftb-searchable-content
        items={this.league.teams.items}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.league.teams.total}
            items={items}
            renderItem={(team: Team) => <ftb-team-card team={team} key={'team' + team._id}></ftb-team-card>}
            rows={3}
            itemMinWidthPx={200}
            itemHeightPx={68}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.team.search_by_team_name[userState.language]}
        categories={[]}
      ></ftb-searchable-content>
    );
  }
}