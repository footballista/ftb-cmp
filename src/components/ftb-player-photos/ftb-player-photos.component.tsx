import { Component, Host, h, Prop, State } from '@stencil/core';
import { Player, PlayerService } from 'ftb-models';
@Component({
  tag: 'ftb-player-photos',
  styleUrl: 'ftb-player-photos.component.scss',
  shadow: false,
})
export class FtbPlayerPhotos {
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
    new PlayerService().loadPlayerPhotos(this.player._id).then(p => {
      this.player.gamesWithPhotos = p.gamesWithPhotos;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-player-photos__wrapper">
          <div class="ftb-player-photos__background">
            <ftb-media-photos
              photoGames={this.player.gamesWithPhotos}
              paginationConfig={this.paginationConfig}
            ></ftb-media-photos>
          </div>
        </div>
      </Host>
    );
  }
}
