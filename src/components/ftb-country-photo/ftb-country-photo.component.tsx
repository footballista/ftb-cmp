import { Component, Host, h, Prop, State, writeTask, Element } from '@stencil/core';
import { envState, Country, checkElementSize } from 'ftb-models';

const MAX_SIZE_THRESHOLD = 100;

@Component({
  tag: 'ftb-country-photo',
  styleUrl: 'ftb-country-photo.component.scss',
  shadow: false,
})
export class FtbLeagueLogo {
  @Prop() country!: Country;
  /** If not defined, image resolution will be detected from on element size */
  @Prop() mode?: 'min' | 'max';
  @State() showPlaceholder: boolean = false;

  @Element() el: HTMLElement;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  url(size: 'min' | 'max') {
    return envState.imgHost + `/img/countries/${this.country._id}-${size}-.png?version=${this.country.photoId}`;
  }

  async connectedCallback() {
    if (!this.country) return;

    const appendMaxImg = () => {
      const pic = document.createElement('picture');
      const source = document.createElement('source');
      const img = document.createElement('img');
      pic.append(source, img);
      source.srcset = this.url('max');
      img.src = this.url('max');
      img.onload = () => writeTask(() => this.el.append(pic));
    };

    if (this.mode == 'max') {
      appendMaxImg();
    } else if (!this.mode) {
      checkElementSize(this.el).then(({ width }) => {
        if (width > MAX_SIZE_THRESHOLD) {
          appendMaxImg();
        }
      });
    }
  }

  render() {
    if (!this.country) return null;

    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-league-logo league={this.country.league} />
        ) : (
          <img
            src={this.url('min')}
            onError={e => this.onImgFail(e.target as HTMLImageElement)}
            alt={this.country.name}
            title={this.country.name}
          />
        )}
      </Host>
    );
  }
}
