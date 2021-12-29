import { Component, h, Host } from '@stencil/core';
import { Game } from 'ftb-models';

@Component({
  tag: 'ftb-game-state-stories',
  styleUrl: 'ftb-game-state.stories.scss',
  shadow: false,
})
export class FtbGameStateStories {
  render() {
    return (
      <Host>
        <h1>Game State</h1>
        <p>Renders game state text</p>
        <ftb-code-snippet code="<ftb-game-state game={new Game({ stateCode: 0 })} />" />
        Will result as: "<ftb-game-state game={new Game({ stateCode: 0 })} />"
        <ftb-code-snippet code="<ftb-game-state game={new Game({ stateCode: 4 })} />" />
        Will result as: "<ftb-game-state game={new Game({ stateCode: 4 })} />"
      </Host>
    );
  }
}
