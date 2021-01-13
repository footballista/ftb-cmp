import { Component, Host, h, Prop } from '@stencil/core';
import { Alert, relativeDate } from 'ftb-models';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-alert-photo',
  styleUrl: 'ftb-alert-photo.component.scss',
  shadow: false,
})
export class FtbAlertPhoto {
  @Prop() alert!: Alert;

  render() {
    return (
      <Host>
        <div class="ftb-alert-photo__wrapper">
          <div class="ftb-alert-photo__background">
            <div class="title">{this.alert.title[userState.language]}</div>
            <div class="date">{relativeDate(this.alert.date)}</div>
            <ftb-game-photo-cover game={this.alert.game}></ftb-game-photo-cover>
          </div>
        </div>
      </Host>
    );
  }
}
