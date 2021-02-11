import { Component, Host, h, Prop, State } from '@stencil/core';
import { Player, PlayerService } from 'ftb-models';
@Component({
  tag: 'ftb-player-news',
  styleUrl: 'ftb-player-news.component.scss',
  shadow: false,
})
export class FtbPlayerNews {
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
    new PlayerService().loadPlayerNews(this.player._id).then(p => {
      this.player.news = p.news;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-player-news__wrapper">
          <div class="ftb-player-news__background">
            <ftb-media-news news={this.player.news} paginationConfig={this.paginationConfig}></ftb-media-news>
          </div>
        </div>
      </Host>
    );
  }
}
