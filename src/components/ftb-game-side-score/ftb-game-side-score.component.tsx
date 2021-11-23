import { Component, h, Host, Prop } from '@stencil/core';
import { Game, GameSide, GameState, translations, userState } from 'ftb-models';

@Component({
  tag: 'ftb-game-side-score',
  styleUrl: 'ftb-game-side-score.component.scss',
  shadow: false,
})
export class FtbGameSideScore {
  @Prop() game!: Game;
  @Prop() side!: GameSide;

  private hasPen() {
    return this.game.home.score.pen > 0 || this.game.away.score.pen > 0;
  }

  render() {
    if (!this.game) return null;

    if (this.game.state !== GameState.CLOSED) {
      return (
        <Host>
          <div class="score no-score"></div>
        </Host>
      );
    } else {
      return (
        <Host>
          <div class={{ score: true, winner: this.side.isWinner, loser: this.side.isLoser }}>
            {this.side.score.ft}
            {this.side.isWinner && this.game.techDefeat && (
              <small class="td">{translations.game.td[userState.language]}</small>
            )}
            {this.hasPen() && <small class="pen">{this.side.score.pen}</small>}
          </div>
        </Host>
      );
    }
  }
}
