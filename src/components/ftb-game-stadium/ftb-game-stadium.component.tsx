import { Component, Host, h, Prop } from '@stencil/core';
import { Game } from 'ftb-models';
@Component({
  tag: 'ftb-game-stadium',
  styleUrl: 'ftb-game-stadium.component.scss',
  shadow: false,
})
export class FtbGameStadium {
  @Prop() game!: Game;

  render() {
    if (!this.game.stadium) return null;

    return (
      <Host>
        <div class="stadium">
          <div class="name">{this.game.stadium.name}</div>
          {this.game.pitch && <div class="pitch">{this.game.pitch.name}</div>}
        </div>
      </Host>
    );
  }
}
