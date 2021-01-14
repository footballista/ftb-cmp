import { Component, Host, h, Prop, State } from '@stencil/core';
import { filter, translations, User, PersonService, diState, userState } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
import { FtbGameCardField } from '@src/components/ftb-game-card/ftb-game-card-fields';
@Component({
  tag: 'ftb-person-games',
  styleUrl: 'ftb-person-games.component.scss',
  shadow: false,
})
export class FtbPersonGames {
  @Prop() person!: User;
  @State() loaded = false;
  private ready$ = new AsyncSubject();

  componentWillLoad() {
    new PersonService(diState.gql).loadPersonGames(this.person._id).then(p => {
      this.person.games = p.games;
      this.loaded = true;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      let items = this.person.games.items;
      filtersOn = Boolean(query);
      if (!filtersOn) return items;
      await this.ready$.toPromise();
      return filter(items, query, ['home.team.name', 'home.team.shortName', 'away.team.name', 'away.team.shortName']);
    };

    return (
      <Host>
        <div class="ftb-person-games__wrapper">
          <div class="ftb-person-games__background">
            <ftb-searchable-content
              items={this.person.games.items}
              key={'ftb-person-games_' + (this.loaded ? '1' : '0')}
              renderItems={items => (
                <ftb-pagination
                  key={'pag_' + (this.loaded ? '1' : '0')}
                  totalItems={filtersOn ? items.length : this.person.games.total}
                  items={items}
                  renderItem={game => (
                    <ftb-game-card
                      key={game._id}
                      game={game}
                      leftFields={[FtbGameCardField.date, FtbGameCardField.time, FtbGameCardField.pitch]}
                      topFields={[FtbGameCardField.champSeason]}
                    ></ftb-game-card>
                  )}
                  rows={2}
                  itemMinWidthPx={200}
                  itemHeightPx={110}
                ></ftb-pagination>
              )}
              filterFn={filterFn}
              placeholder={translations.game.search_by_game_teams[userState.language]}
              categories={[]}
            ></ftb-searchable-content>
          </div>
        </div>
      </Host>
    );
  }
}
