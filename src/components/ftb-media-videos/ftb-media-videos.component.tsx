import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { Collection, filter, Game, translations, userState } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
@Component({
  tag: 'ftb-media-videos',
  styleUrl: 'ftb-media-videos.component.scss',
  shadow: false,
})
export class FtbMediaVideos {
  @Prop() videoGames: Collection<Game>;
  @Prop() dataLoaded: boolean;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };
  private loaded$ = new AsyncSubject<boolean>();

  @Watch('dataLoaded') onDataLoaded() {
    this.loaded$.next(true);
    this.loaded$.complete();
  }

  render() {
    let filtersOn = false;
    const filterFn = async (_, query) => {
      filtersOn = Boolean(query);
      if (!filtersOn) return this.videoGames.items;
      await this.loaded$.toPromise();
      return filter(this.videoGames.items, query, ['home.team.name', 'away.team.name']);
    };

    const renderVideoTitle = (game: Game) => (
      <div class="teams">
        {game.home.team.name} - {game.away.team.name}
      </div>
    );

    return (
      <Host>
        <ftb-searchable-content
          class="video-tab"
          items={this.videoGames.items}
          filterFn={filterFn}
          placeholder={translations.game.search_by_game_teams[userState.language]}
          categories={[]}
          key={'league-video-searchable' + (this.dataLoaded ? '1' : '0')}
          renderItems={items => (
            <ftb-pagination
              totalItems={filtersOn ? items.length : this.videoGames.total}
              items={items}
              renderItem={(game: Game) => (
                <ftb-video
                  key={'video_' + game._id}
                  video={game.videos[game.videos.length - 1]}
                  renderTitle={() => renderVideoTitle(game)}
                ></ftb-video>
              )}
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
      </Host>
    );
  }
}
