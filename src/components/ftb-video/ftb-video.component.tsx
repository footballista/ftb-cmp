import { Component, Host, h, Prop } from '@stencil/core';
import { GameVideo } from 'ftb-models';
@Component({
  tag: 'ftb-video',
  styleUrl: 'ftb-video.component.scss',
  shadow: false,
})
export class FtbVideo {
  @Prop() video!: GameVideo;

  render() {
    return (
      <Host>
        <a class="ftb-video__wrapper" href={this.video.link} title={this.video.name} target="_blank">
          <div class="ftb-video__background">
            <div class="ftb-video__image">
              <ftb-improving-img
                sources={[this.video.covers.lq, this.video.covers.mq, this.video.covers.hq]}
              ></ftb-improving-img>
            </div>
            <div class="ftb-video__title">{this.video.name}</div>
          </div>
        </a>
      </Host>
    );
  }
}
