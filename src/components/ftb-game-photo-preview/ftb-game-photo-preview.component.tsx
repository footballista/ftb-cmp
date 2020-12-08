import { Component, Host, h, Prop, Element } from '@stencil/core';
import { GamePhoto } from 'ftb-models';
@Component({
  tag: 'ftb-game-photo-preview',
  styleUrl: 'ftb-game-photo-preview.component.scss',
  shadow: false,
})
export class FtbGamePhotoPreview {
  @Prop() photo: GamePhoto;
  @Element() element: HTMLElement;

  render() {
    const sources = [this.photo.thumb];
    if (this.element.offsetWidth > 150 || this.element.offsetHeight > 100) {
      sources.push(this.photo.middle);
    }

    return (
      <Host>
        <div class="game-photo-wrapper">
          <div class="bg">
            <ftb-improving-img sources={sources.map(s => s.url)}></ftb-improving-img>
          </div>
        </div>
      </Host>
    );
  }
}
