import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { Collection, filter, Game, translations, userState } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
@Component({
  tag: 'ftb-media-photos',
  styleUrl: 'ftb-media-photos.component.scss',
  shadow: false,
})
export class FtbMediaPhotos {
  @Prop() photoGames: Collection<Game>;
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
      if (!query) return this.photoGames.items;
      await this.loaded$.toPromise();
      filtersOn = Boolean(query);
      return filter(this.photoGames.items, query, ['home.team.name', 'away.team.name']);
    };
    return (
      <Host>
        <ftb-searchable-content
          class="photo-tab"
          items={this.photoGames.items}
          filterFn={filterFn}
          placeholder={translations.game.search_by_game_teams[userState.language]}
          categories={[]}
          key={'league-photo-searchable' + (this.dataLoaded ? '1' : '0')}
          renderItems={items => (
            <ftb-pagination
              totalItems={filtersOn ? items.length : this.photoGames.total}
              items={items}
              renderItem={(game: Game) => (
                <ftb-game-photo-cover game={game} key={'photo_' + game._id}></ftb-game-photo-cover>
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
