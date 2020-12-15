import { Component, Host, h, Prop } from '@stencil/core';
import { filter, League, Stadium, translations } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
import { GraphqlClient } from 'ftb-models/dist/tools/clients/graphql.client';
import { HttpClient } from 'ftb-models/dist/tools/clients/http.client';
import { User } from 'ftb-models/dist/models/user.model';
import { LeagueService } from 'ftb-models/dist/services/league.service';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-league-stadiums',
  styleUrl: 'ftb-league-stadiums.component.scss',
  shadow: false,
})
export class FtbLeagueStadiums {
  @Prop() league!: League;
  private ready$ = new AsyncSubject<boolean>();

  componentWillLoad() {
    //todo move somewhere
    const gql = new GraphqlClient(new HttpClient('AFL_RU', new User()), 'http://localhost:3004/graphql/');
    new LeagueService(gql).loadLeagueStadiums(this.league._id).then(l => {
      this.league.stadiums = l.stadiums;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-league-stadiums__wrapper">
          <div class="ftb-league-stadiums__background">
            <h2 class="component-header">{translations.stadium.stadiums[userState.language]}</h2>
            <div class="ftb-league-stadiums__content">{this.renderStadiumsList()}</div>
          </div>
        </div>
      </Host>
    );
  }

  private renderStadiumsList() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      await this.ready$.toPromise();
      filtersOn = Boolean(query);
      return filter(this.league.stadiums.items, query, ['name']);
    };

    return (
      <ftb-searchable-content
        items={this.league.stadiums.items}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.league.stadiums.total}
            items={items}
            renderItem={(s: Stadium) => <ftb-stadium-card stadium={s} key={'stadium' + s._id}></ftb-stadium-card>}
            rows={1}
            itemMinWidthPx={200}
            itemHeightPx={160}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.stadium.search_by_stadium_name[userState.language]}
        categories={[]}
      ></ftb-searchable-content>
    );
  }
}
