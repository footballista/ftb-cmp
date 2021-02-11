import { Component, Host, h, Prop, State } from '@stencil/core';
import { Player, PlayerService } from 'ftb-models';
@Component({
  tag: 'ftb-player-videos',
  styleUrl: 'ftb-player-videos.component.scss',
  shadow: false,
})
export class FtbPlayerVideos {
  @Prop() player!: Player;
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
    new PlayerService().loadPlayerVideos(this.player._id).then(p => {
      this.player.gamesWithVideos = p.gamesWithVideos;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-player-videos__wrapper">
          <div class="ftb-player-videos__background">
            <ftb-media-videos
              videoGames={this.player.gamesWithVideos}
              paginationConfig={this.paginationConfig}
            ></ftb-media-videos>
          </div>
        </div>
      </Host>
    );
  }
}
