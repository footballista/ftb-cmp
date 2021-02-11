import { Component, Host, h, Prop, State } from '@stencil/core';
import { Game, GameService } from 'ftb-models';
@Component({
  tag: 'ftb-game-news',
  styleUrl: 'ftb-game-news.component.scss',
  shadow: false,
})
export class FtbGameNews {
  @Prop() game!: Game;
  @State() loaded: boolean;

  componentWillLoad() {
    new GameService().loadGameMedia(this.game._id).then(g => {
      this.game.news = g.news;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-game-news__wrapper">
          <div class="ftb-game-news__background"></div>
        </div>
      </Host>
    );
  }
}
