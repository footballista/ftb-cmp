import { Component, h, Host } from '@stencil/core';
import { Game, StageFormat } from 'ftb-models';

@Component({
  tag: 'ftb-game-tour-stories',
  styleUrl: 'ftb-game-tour.stories.scss',
  shadow: false,
})
export class FtbGameTourStories {
  render() {
    return (
      <Host>
        <h1>Game Tour</h1>
        <p>Renders game tour text. Text depends on game tour number and stage format (league/cup)</p>
        <ftb-code-snippet code="<ftb-game-tour game={new Game({tourNumber: 1, stage: { format: StageFormat.league }})}/>" />
        Will result as: "<ftb-game-tour game={new Game({ tourNumber: 1, stage: { format: StageFormat.league } })} />"
        <ftb-code-snippet code="<ftb-game-tour game={new Game({tourNumber: 1, stage: { format: StageFormat.cup }})}/>" />
        Will result as: "<ftb-game-tour game={new Game({ tourNumber: 1, stage: { format: StageFormat.cup } })} />"
      </Host>
    );
  }
}
