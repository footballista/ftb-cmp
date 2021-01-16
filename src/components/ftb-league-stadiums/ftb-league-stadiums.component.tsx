import { Component, Host, h, Prop } from '@stencil/core';
import {
  filter,
  League,
  Stadium,
  translations,
  GraphqlClient,
  HttpClient,
  User,
  LeagueService,
  userState,
} from 'ftb-models';
import { AsyncSubject } from 'rxjs';

@Component({
  tag: 'ftb-league-stadiums',
  styleUrl: 'ftb-league-stadiums.component.scss',
  shadow: false,
})
export class FtbLeagueStadiums {
  @Prop() league!: League;
  @Prop() itemMinWidthPx = 200;
  @Prop() itemHeightPx = 168;
  @Prop() rows = 1;
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
    if (!this.league.stadiums.total) return null;
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
            rows={this.rows}
            itemMinWidthPx={this.itemMinWidthPx}
            itemHeightPx={this.itemHeightPx}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.stadium.search_by_stadium_name[userState.language]}
        categories={[]}
      ></ftb-searchable-content>
    );
  }
}
