import { Component, Host, h, Prop, Element, State } from '@stencil/core';
import { GameVideo } from 'ftb-models';

@Component({
  tag: 'ftb-video-cover',
  styleUrl: 'ftb-video-cover.component.scss',
  shadow: false,
})
export class FtbVideoCover {
  @Prop() video!: GameVideo;
  @State() height: number;

  @Element() el: HTMLElement;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
  }

  componentWillLoad() {
    console.log('test');
    function checkElementSize(el: HTMLElement, iterationLimit = 40, iteration = 0) {
      const { offsetWidth, offsetHeight } = el;
      if (!offsetWidth && !offsetHeight) {
        if (iteration++ < iterationLimit) {
          console.log('1', iteration, offsetWidth);
          return requestAnimationFrame(checkElementSize(el, iterationLimit, iteration));
        } else {
          console.log('2', iteration, offsetHeight);
          return { width: 0, height: 0 };
        }
      } else {
        console.log('3', iteration, offsetWidth);
        return { width: offsetWidth, height: offsetHeight };
      }
    }
    console.log(this.el);
    console.log(checkElementSize(this.el));
  }

  render() {
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
          {this.height > 180 ? (
            <picture>
              <img
                src={this.video.covers.hq}
                title={this.video.name}
                alt={this.video.name}
                onError={e => this.onImgFail(e.target as HTMLImageElement)}
                loading="lazy"
              />
            </picture>
          ) : null}
        </a>
      </Host>
    );
  }
}
