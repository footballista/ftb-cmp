import { Component, Host, h, Prop, State } from '@stencil/core';
import { diState, Game, GameService } from 'ftb-models';
@Component({
  tag: 'ftb-game-videos',
  styleUrl: 'ftb-game-videos.component.scss',
  shadow: false,
})
export class FtbGameVideos {
  @Prop() game!: Game;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };
  @State() loaded: boolean;

  componentWillLoad() {
    new GameService(diState.gql).loadGameVideos(this.game._id).then(g => {
      this.game.videos = g.videos;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-game-videos__wrapper">
          <div class="ftb-game-videos__background">
            <ftb-pagination
              key="game-media-video"
              totalItems={this.game.videos.length}
              items={this.game.videos}
              renderItem={v => <ftb-video video={v}></ftb-video>}
              rows={this.paginationConfig.rows}
              fixedContainerHeightPx={this.paginationConfig.fixedContainerHeightPx}
              itemMinWidthPx={this.paginationConfig.itemMinWidthPx}
              itemMinHeightPx={this.paginationConfig.itemMinHeightPx}
              stretchX={this.paginationConfig.stretchX}
              stretchY={this.paginationConfig.stretchY}
              XtoY={this.paginationConfig.XtoY}
            ></ftb-pagination>
          </div>
        </div>
      </Host>
    );
  }
}
