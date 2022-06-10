import { Component, Host, h, State, Prop } from '@stencil/core';
import Flag from '../../assets/icons/flag.svg';
import { envState } from 'ftb-models';

const aliases = {
  ru: 'russia',
  en: 'united_kingdom',
  eng: 'united_kingdom',
  ua: 'ukraine',
  pl: 'poland',
  es: 'spain',
  fr: 'france',
  th: 'thailand',
  eu: 'european_union',
  esp: 'spain',
  ger: 'germany',
  fra: 'france',
  por: 'portugal',
  bnl: 'belgium',
  ita: 'italy',
  rus: 'russia',
  srb: 'serbia',
  usa: 'united_states',
  ausswi: 'switzerland',
  bel: 'belgium',
  ned: 'netherlands',
  gbr: 'united_kingdom',
  aus: 'austria',
  cis: 'christmas_island',
};

@Component({
  tag: 'ftb-flag',
  styleUrl: 'ftb-flag.component.scss',
  shadow: false,
})
export class FtbFlag {
  @Prop() flag!: string;
  /** if  passed, component will callback color palette, defined for flag */
  @Prop() extractColors?: (RGBs: Array<[number, number, number]>) => any;

  /** Image loading failed - showing default placeholder */
  @State() showPlaceholder: boolean = false;

  getPalette: (el: HTMLImageElement) => Array<[number, number, number]>;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  async componentWillLoad() {
    if (this.extractColors) {
      this.getPalette = (await import('colorthief')).default.prototype.getPalette;
    }
  }

  onImgLoad(el: HTMLImageElement) {
    if (this.getPalette) {
      let image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = async () => {
        this.extractColors(this.getPalette(image));
      };
      image.src = el.src;
    }
  }

  render() {
    if (!this.flag) return null;

    let flagAlias = this.flag.toLowerCase().replace(new RegExp(' ', 'g'), '_');
    if (aliases[this.flag]) {
      flagAlias = aliases[this.flag];
    }
    const url = envState.localHost + `/assets/flags/${flagAlias}.svg`;

    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={Flag} />
        ) : (
          <img
            src={url}
            onError={e => this.onImgFail(e.target as HTMLImageElement)}
            onLoad={e => this.onImgLoad(e.target as HTMLImageElement)}
          />
        )}
      </Host>
    );
  }
}
