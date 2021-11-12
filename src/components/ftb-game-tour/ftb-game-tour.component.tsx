import { Component, h, Host, Prop } from '@stencil/core';
import { Game, StageFormat, translations, userState } from 'ftb-models';

@Component({
  tag: 'ftb-game-tour',
  styleUrl: 'ftb-game-tour.component.scss',
  shadow: true,
})
export class FtbGameTour {
  @Prop() game!: Game;

  render() {
    if (!this.game) return null;
    return (
      <Host>
        {this.game.stage.format === StageFormat.cup
          ? translations.cup_rounds[userState.language][this.game.tourNumber]
          : this.game.tourNumber + ' ' + translations.round[userState.language]}
      </Host>
    );
  }
}
