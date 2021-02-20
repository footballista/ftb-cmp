import { Component, Host, h, Prop, State } from '@stencil/core';
import { GameVideo } from 'ftb-models';

@Component({
  tag: 'ftb-video',
  styleUrl: 'ftb-video.component.scss',
  shadow: false,
})
export class FtbVideo {
  @Prop() video!: GameVideo;
  @Prop() renderTitle: () => string;
  @State() currentIdx: number = -1;
  @State() firstImgLoaded = false;
  private images = [this.video.covers.lq, this.video.covers.mq, this.video.covers.hq];

  /** cancelling img load if component destroyed */
  disconnectedCallback() {
    this.images = ['', '', ''];
  }

  onLoad(idx: number) {
    if (idx > this.currentIdx) this.currentIdx = idx;
    this.firstImgLoaded = true;
  }

  render() {
    return (
      <Host>
        <a class="ftb-video__wrapper" href={this.video.link} title={this.video.name} target="_blank">
          <div class={{ 'ftb-video__background': true, 'loaded': this.firstImgLoaded }}>
            <div
              class="ftb-video__image"
              style={this.firstImgLoaded ? { 'background-image': `url('${this.images[this.currentIdx]}')` } : {}}
            ></div>
            <div class="ftb-video__title">{this.renderTitle ? this.renderTitle() : this.video.name}</div>
          </div>
        </a>
        {this.images.map((src, idx) => (
          <img class="ftb-video__service-img" src={src} onLoad={() => this.onLoad(idx)}></img>
        ))}
      </Host>
    );
  }
}
