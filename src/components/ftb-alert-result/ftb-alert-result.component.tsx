import { Component, h, Host, Prop } from '@stencil/core';
import { Alert, GameState, relativeDate } from 'ftb-models';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-alert-result',
  styleUrl: 'ftb-alert-result.component.scss',
  shadow: false,
})
export class FtbAlertResult {
  @Prop() alert!: Alert;

  render() {
    const g = this.alert.game;
    g.state = GameState.CLOSED;
    return (
      <Host>
        <div class="ftb-alert-result__wrapper">
          <div class="ftb-alert-result__background">
            <div class="title">{this.alert.title[userState.language]}</div>
            <div class="date">{relativeDate(this.alert.date)}</div>
            <div class="content">
              <ftb-team-logo team={g.home.team}></ftb-team-logo>
              {g.home.team.name}
              <ftb-game-side-score game={g} side={g.home}></ftb-game-side-score>
              <div class="delimiter">-</div>
              <ftb-game-side-score game={g} side={g.away}></ftb-game-side-score>
              {g.away.team.name}
              <ftb-team-logo team={g.away.team}></ftb-team-logo>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
