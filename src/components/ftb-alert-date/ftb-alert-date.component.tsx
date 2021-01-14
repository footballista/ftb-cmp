import { Component, Host, h, Prop } from '@stencil/core';
import { Alert, relativeDate, userState } from 'ftb-models';

@Component({
  tag: 'ftb-alert-date',
  styleUrl: 'ftb-alert-date.component.scss',
  shadow: false,
})
export class FtbAlertDate {
  @Prop() alert!: Alert;

  render() {
    const g = this.alert.game;

    return (
      <Host>
        <div class="ftb-alert-date__wrapper">
          <div class="ftb-alert-date__background">
            <div class="title">{this.alert.title[userState.language]}</div>
            <div class="date">{relativeDate(this.alert.date)}</div>
            <div class="content">
              <ftb-team-logo team={g.home.team}></ftb-team-logo>
              {g.home.team.name}
              <div class="date-place">
                <div class="date">{relativeDate(g.date)}</div>
                <div class="stadium">{g.stadium.name}</div>
                {g.pitch && <div class="pitch">{g.pitch.name}</div>}
              </div>
              {g.away.team.name}
              <ftb-team-logo team={g.away.team}></ftb-team-logo>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
