import { Component, Host, h, Prop } from '@stencil/core';
import { Game, GameState, translations, userState } from 'ftb-models';

@Component({
  tag: 'ftb-game-state',
  styleUrl: 'ftb-game-state.component.scss',
  shadow: false,
})
export class FtbGameState {
  @Prop() game!: Game;

  render() {
    if (this.game.state < GameState.STARTED) {
      return <Host>{translations.game.not_started[userState.language]}</Host>;
    } else if (this.game.state < GameState.CLOSED) {
      return <Host>{translations.game.in_progress[userState.language]}</Host>;
    } else {
      return <Host>{translations.game.ended[userState.language]}</Host>;
    }
  }
}
