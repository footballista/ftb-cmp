import { Component, Host, h, Prop } from '@stencil/core';
import { Alert, relativeDate, userState } from 'ftb-models';

@Component({
  tag: 'ftb-alert-wish',
  styleUrl: 'ftb-alert-wish.component.scss',
  shadow: false,
})
export class FtbAlertWish {
  @Prop() alert!: Alert;

  render() {
    return (
      <Host>
        <div class="ftb-alert-wish__wrapper">
          <div class="ftb-alert-wish__background">
            <div class="title">{this.alert.title[userState.language]}</div>
            <div class="date">{relativeDate(this.alert.date)}</div>
            <div class="content">
              <ftb-team-logo team={this.alert.game.home.team}></ftb-team-logo>
              {this.alert.game.home.team.name}-{this.alert.game.away.team.name}
              <ftb-team-logo team={this.alert.game.away.team}></ftb-team-logo>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
