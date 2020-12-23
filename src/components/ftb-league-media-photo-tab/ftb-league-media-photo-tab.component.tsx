import { Component, h, Prop } from '@stencil/core';
import { Game, League, Post, translations } from 'ftb-models';
import { LeagueService } from 'ftb-models/dist/services/league.service';
import { diStore } from '@src/tools/di.store';
import userState from '@src/tools/user.store';
@Component({
  tag: 'ftb-league-media-photo-tab',
  styleUrl: 'ftb-league-media-photo-tab.component.scss',
  shadow: false,
})
export class FtbLeagueMediaPhotoTab {
  @Prop() league!: League;
  private filtersOn = false;
  private leagueService = new LeagueService(diStore.gql);
  private abortHttpController: AbortController;

  componentWillLoad() {
    for (let i = 0; i < this.league.gamesWithPhotos.total; i++) {
      this.league.gamesWithPhotos.items[i] ??= new Game({});
    }
  }

  private async filterFn(query) {
    this.abortHttpController?.abort();
    this.filtersOn = Boolean(query);
    if (this.filtersOn) {
      this.abortHttpController = new AbortController();
      const league = await this.leagueService.searchLeaguePhotoGames(
        this.league._id,
        query,
        this.abortHttpController.signal,
      );
      return league.gamesWithPhotos.items;
    } else {
      return this.league.gamesWithPhotos.items;
    }
  }

  private async getItemsForInterval(items: Post[], offset: number, limit: number) {
    if (this.filtersOn) return items.slice(offset, offset + limit);

    this.abortHttpController?.abort();
    if (this.league.gamesWithPhotos.items.slice(offset, offset + limit).some(p => !p._id)) {
      this.abortHttpController = new AbortController();
      const league = await this.leagueService.loadLeaguePhotoGames(
        this.league._id,
        offset,
        limit,
        this.abortHttpController.signal,
      );
      this.league.gamesWithPhotos.items.splice(offset, limit, ...league.gamesWithPhotos.items);
      return this.league.gamesWithPhotos.items.slice(offset, offset + limit);
    } else {
      return this.league.gamesWithPhotos.items.slice(offset, offset + limit);
    }
  }

  render() {
    return (
      <ftb-searchable-content
        class="photos-tab"
        key="league-photos-pagination"
        items={this.league.news.items}
        filterFn={(_, q) => this.filterFn(q)}
        placeholder={translations.game.search_by_game_teams[userState.language]}
        categories={[]}
        renderItems={items => (
          <ftb-pagination
            key="league-photo-pagination"
            totalItems={this.filtersOn ? items.length : this.league.gamesWithPhotos.total}
            items={items}
            renderItem={(game: Game) => (
              <ftb-game-photo-cover game={game} key={'photo_' + game._id}></ftb-game-photo-cover>
            )}
            getItemsForInterval={(i, o, l) => this.getItemsForInterval(i, o, l)}
            rows={1}
            itemMinWidthPx={200}
            itemHeightPx={150}
          ></ftb-pagination>
        )}
      ></ftb-searchable-content>
    );
  }
}
