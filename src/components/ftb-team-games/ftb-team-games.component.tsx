import { Component, h, Host, Prop, State } from '@stencil/core';
import { filter, Game, translations, Team, userState, TeamService } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
import { FtbGameCardField } from '../ftb-game-card/ftb-game-card-fields';

@Component({
  tag: 'ftb-team-games',
  styleUrl: 'ftb-team-games.component.scss',
  shadow: false,
})
export class FtbTeamGames {
  @Prop() team!: Team;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };
  @State() loaded = false;
  private ready$ = new AsyncSubject();

  componentWillLoad() {
    new TeamService().loadTeamGames(this.team._id).then(t => {
      this.team.games = t.games;
      this.loaded = true;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-team-games__wrapper">
          <div class="ftb-team-games__background">{this.renderContent()}</div>
        </div>
      </Host>
    );
  }

  private renderContent() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      let items = this.team.games.items;
      filtersOn = Boolean(query);
      if (!filtersOn) return items;
      await this.ready$.toPromise();
      return filter(items, query, ['home.team.name', 'home.team.shortName', 'away.team.name', 'away.team.shortName']);
    };
    const cardFn = (g: Game) => (
      <ftb-game-card
        key={g._id}
        game={g}
        leftFields={[FtbGameCardField.date, FtbGameCardField.time, FtbGameCardField.stadium]}
        topFields={[FtbGameCardField.champSeason, FtbGameCardField.round]}
      ></ftb-game-card>
    );

    return (
      <ftb-searchable-content
        items={this.team.games.items}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.team.games.total}
            items={items}
            renderItem={cardFn}
            rows={this.paginationConfig.rows}
            fixedContainerHeightPx={this.paginationConfig.fixedContainerHeightPx}
            itemMinWidthPx={this.paginationConfig.itemMinWidthPx}
            itemMinHeightPx={this.paginationConfig.itemMinHeightPx}
            stretchX={this.paginationConfig.stretchX}
            stretchY={this.paginationConfig.stretchY}
            XtoY={this.paginationConfig.XtoY}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.game.search_by_game_teams[userState.language]}
        categories={[]}
      ></ftb-searchable-content>
    );
  }
}
