import { Component, Host, h, State, Prop, EventEmitter, Event } from '@stencil/core';
import Flag from '../../assets/icons/flag.svg';

const aliases = {
  ru: 'russia',
  en: 'united kingdom',
  eng: 'united kingdom',
  ua: 'ukraine',
  pl: 'poland',
  es: 'spain',
  fr: 'france',
  th: 'thailand',
  eu: 'european union',
  esp: 'spain',
  ger: 'germany',
  fra: 'france',
  por: 'portugal',
  bnl: 'belgium',
  ita: 'italy',
  rus: 'russia',
  srb: 'serbia',
  usa: 'united states',
  ausswi: 'switzerland',
  bel: 'belgium',
  ned: 'netherlands',
  gbr: 'united kingdom',
  aus: 'austria',
  cis: 'christmas island',
};

@Component({
  tag: 'ftb-flag',
  styleUrl: 'ftb-flag.component.scss',
  shadow: false,
})
export class FtbFlag {
  @Prop() flag: string;
  @State() loaded = false;
  @State() showPlaceholder = false;
  @Event() color: EventEmitter<[number, number, number][]>;
  private flagAlias: string;
  private url: string;

  componentWillLoad() {
    this.flagAlias = this.flag.toLowerCase();
    if (aliases[this.flag]) {
      this.flagAlias = aliases[this.flag];
    }

    this.url = `assets/flags/${this.flagAlias}.svg`;
  }

  onImgFail() {
    this.showPlaceholder = true;
    this.color.emit([
      [0, 0, 0],
      [255, 255, 255],
      [0, 0, 100],
    ]);
  }

  render() {
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={Flag}></ftb-icon>
        ) : (
          <ftb-img src={this.url} onFailed={() => this.onImgFail()} onColor={e => this.color.emit(e.detail)}></ftb-img>
        )}
      </Host>
    );
  }
}
