import { Component, Host, h, Prop } from '@stencil/core';
import { Game, translations } from 'ftb-models';
import userState from '@src/tools/user.store';
import dayjs from 'dayjs';

@Component({
  tag: 'ftb-game-date',
  styleUrl: 'ftb-game-date.component.scss',
  shadow: false,
})
export class FtbGameDate {
  @Prop() game!: Game;

  render() {
    if (!this.game.date) return <div class="time-not-set">{translations.game.time_not_set[userState.language]}</div>;

    return (
      <Host>
        <div class="date">
          {this.game.date.format('YYYY') == dayjs().format('YYYY')
            ? this.game.date.format('DD ') +
              translations.days[userState.language][this.game.date.month()] +
              ' (' +
              translations.days[userState.language][this.game.date.day()] +
              ')'
            : this.game.date.format('DD.MM.YYYY')}
        </div>
        <div class="time">{this.game.date.format('HH:mm')}</div>
      </Host>
    );
  }
}
