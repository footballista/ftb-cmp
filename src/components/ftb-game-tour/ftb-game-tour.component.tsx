import { Component, Element, h, Host, Prop } from '@stencil/core';
import { Game, StageFormat, translations } from 'ftb-models';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-game-tour',
  styleUrl: 'ftb-game-tour.component.scss',
  shadow: true,
})
export class FtbGameTour {
  @Prop() game: Game;
  @Element() element: HTMLElement;

  render() {
    return (
      <Host>
        {this.game.stage.format === StageFormat.cup
          ? translations.cup_rounds[userState.language][this.game.tourNumber]
          : this.game.tourNumber + ' ' + translations.round[userState.language]}
      </Host>
    );
  }
}
