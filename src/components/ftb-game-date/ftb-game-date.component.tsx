import { Component, Host, h, Prop } from '@stencil/core';
import { Game, translations, userState } from 'ftb-models';
import dayjs from 'dayjs';

@Component({
  tag: 'ftb-game-date',
  styleUrl: 'ftb-game-date.component.scss',
  shadow: false,
})
export class FtbGameDate {
  @Prop() game!: Game;
  @Prop() withtime = true;

  render() {
    if (!this.game) return null;

    if (!this.game.date) return <div class="time-not-set">{translations.game.time_not_set[userState.language]}</div>;

    return (
      <Host>
        <div class="date">
          {this.game.date.format('YYYY') == dayjs().format('YYYY') ? this.currentYearDate() : this.otherYearDate()}
        </div>
        {this.withtime && <div class="time">{this.game.date.format('HH:mm')}</div>}
      </Host>
    );
  }

  private currentYearDate() {
    return (
      this.game.date.format('DD ') +
      translations.months[userState.language][this.game.date.month()] +
      ' (' +
      translations.days[userState.language][this.game.date.day()] +
      ')'
    );
  }

  private otherYearDate() {
    return this.game.date.format('DD.MM.YYYY');
  }
}
