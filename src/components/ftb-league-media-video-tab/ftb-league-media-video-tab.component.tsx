import { Component, h, Prop } from '@stencil/core';
import { Game, League, Post, translations, LeagueService, diState, userState } from 'ftb-models';

@Component({
  tag: 'ftb-league-media-video-tab',
  styleUrl: 'ftb-league-media-video-tab.component.scss',
  shadow: false,
})
export class FtbLeagueMediaVideoTab {
  @Prop() league!: League;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };
  private filtersOn = false;
  private leagueService = new LeagueService(diState.gql);
  private abortHttpController: AbortController;

  componentWillLoad() {
    for (let i = 0; i < this.league.gamesWithVideos.total; i++) {
      this.league.gamesWithVideos.items[i] ??= new Game({});
    }
  }

  private async filterFn(query) {
    this.abortHttpController?.abort();
    this.filtersOn = Boolean(query);
    if (this.filtersOn) {
      this.abortHttpController = new AbortController();
      const league = await this.leagueService.searchLeagueVideoGames(
        this.league._id,
        query,
        this.abortHttpController.signal,
      );
      return league.gamesWithVideos.items;
    } else {
      return this.league.gamesWithVideos.items;
    }
  }

  private async getItemsForInterval(items: Post[], offset: number, limit: number) {
    if (this.filtersOn) return items.slice(offset, offset + limit);

    this.abortHttpController?.abort();
    if (this.league.gamesWithVideos.items.slice(offset, offset + limit).some(p => !p._id)) {
      this.abortHttpController = new AbortController();
      const league = await this.leagueService.loadLeagueVideoGames(
        this.league._id,
        offset,
        limit,
        this.abortHttpController.signal,
      );
      this.league.gamesWithVideos.items.splice(offset, limit, ...league.gamesWithVideos.items);
      return this.league.gamesWithVideos.items.slice(offset, offset + limit);
    } else {
      return this.league.gamesWithVideos.items.slice(offset, offset + limit);
    }
  }

  private renderVideoTitle(g: Game) {
    return (
      <div class="teams">
        {g.home.team.name} - {g.away.team.name}
      </div>
    );
  }

  render() {
    return (
      <ftb-searchable-content
        class="videos-tab"
        key="league-videos-pagination"
        items={this.league.news.items}
        filterFn={(_, q) => this.filterFn(q)}
        placeholder={translations.game.search_by_game_teams[userState.language]}
        categories={[]}
        renderItems={items => (
          <ftb-pagination
            key="league-videos-pagination"
            totalItems={this.filtersOn ? items.length : this.league.gamesWithVideos.total}
            items={items}
            renderItem={(game: Game) => (
              <ftb-video
                key={'video_' + game._id}
                video={game.videos[game.videos.length - 1]}
                renderTitle={() => this.renderVideoTitle(game)}
              ></ftb-video>
            )}
            getItemsForInterval={(i, o, l) => this.getItemsForInterval(i, o, l)}
            rows={this.paginationConfig.rows}
            fixedContainerHeightPx={this.paginationConfig.fixedContainerHeightPx}
            itemMinWidthPx={this.paginationConfig.itemMinWidthPx}
            itemMinHeightPx={this.paginationConfig.itemMinHeightPx}
            stretchX={this.paginationConfig.stretchX}
            stretchY={this.paginationConfig.stretchY}
            XtoY={this.paginationConfig.XtoY}
          ></ftb-pagination>
        )}
      ></ftb-searchable-content>
    );
  }
}
