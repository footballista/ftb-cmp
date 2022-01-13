import { Component, Host, h, Prop, Element, writeTask } from '@stencil/core';
import { checkElementSize, GameVideo } from 'ftb-models';

const HQ_SIZE_THRESHOLD_PX = 180;

@Component({
  tag: 'ftb-video-cover',
  styleUrl: 'ftb-video-cover.component.scss',
  shadow: false,
})
export class FtbVideoCover {
  @Prop() video!: GameVideo;
  height: number;

  @Element() el: HTMLElement;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
  }

  connectedCallback() {
    if (!this.video) return;

    checkElementSize(this.el).then(({ height }) => {
      if (height > HQ_SIZE_THRESHOLD_PX) {
        const hqImg = document.createElement('img');
        hqImg.title = this.video.name;
        hqImg.alt = this.video.name;
        hqImg.src = this.video.covers.hq;
        const pic = document.createElement('picture');
        pic.appendChild(hqImg);
        hqImg.onload = () => writeTask(() => this.el.children[0].append(pic));
      }
    });
  }

  render() {
    if (!this.video) return;

    return (
      <Host>
        <a href={this.video.link}>
          <picture>
            <img
              src={this.video.covers.mq}
              title={this.video.name}
              alt={this.video.name}
              onError={e => this.onImgFail(e.target as HTMLImageElement)}
            />
          </picture>
        </a>
      </Host>
    );
  }
}
