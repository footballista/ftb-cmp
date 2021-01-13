import { Component, Host, h, Prop } from '@stencil/core';
import { Alert, relativeDate } from 'ftb-models';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-alert-video',
  styleUrl: 'ftb-alert-video.component.scss',
  shadow: false,
})
export class FtbAlertVideo {
  @Prop() alert!: Alert;

  render() {
    return (
      <Host>
        <div class="ftb-alert-video__wrapper">
          <div class="ftb-alert-video__background">
            <div class="title">{this.alert.title[userState.language]}</div>
            <div class="date">{relativeDate(this.alert.date)}</div>
            <div class="content">
              <ftb-video video={this.alert.game.videos[this.alert.game.videos.length - 1]}></ftb-video>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
