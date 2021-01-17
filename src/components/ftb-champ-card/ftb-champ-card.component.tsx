import { Component, Host, h, Prop, State } from '@stencil/core';
import { Champ, translations, userState } from 'ftb-models';

@Component({
  tag: 'ftb-champ-card',
  styleUrl: 'ftb-champ-card.component.scss',
  shadow: false,
})
export class FtbChampCard {
  @Prop() champ!: Champ;
  @State() bg = [];
  @State() loaded = false;

  private onFlagColor(palette) {
    this.bg = [
      'linear-gradient(to right, rgba(' +
        [...palette[0], 1].join(', ') +
        '), rgba(' +
        [...palette[0], 0].join(', ') +
        '))',
      'linear-gradient(to right, rgba(' +
        [...palette[2], 0].join(', ') +
        '), rgba(' +
        [...palette[2], 1].join(', ') +
        '))',

      'rgba(' + [...palette[1], 1].join(', ') + ')',
    ];
    this.loaded = true;
  }

  render() {
    return (
      <Host>
        <ftb-link
          route="season"
          params={{
            seasonId: this.champ.seasons[0]._id,
            tournamentName: this.champ.name + ' - ' + this.champ.seasons[0].name,
          }}
        >
          <div class={{ 'ftb-champ-card__wrapper': true, 'loaded': this.loaded }}>
            <div class="ftb-champ-card__background">
              <div class="ftb-champ-card__color">
                <div class="ftb-champ-card__color-layer" style={{ background: this.bg[0] }}></div>
                <div class="ftb-champ-card__color-layer" style={{ background: this.bg[1] }}></div>
                <div class="ftb-champ-card__color-layer" style={{ background: this.bg[2] }}></div>
              </div>
              <div class="ftb-champ-card__content">
                <ftb-flag
                  flag={this.champ.country.flag}
                  onColor={e => this.onFlagColor(e.detail)}
                  key={this.champ.country.flag}
                ></ftb-flag>
                <div class="ftb-champ-card__data">
                  <div class="ftb-champ-card__country-name">{this.champ.country.name}</div>
                  <div class="ftb-champ-card__champ-name">{this.champ.name}</div>
                  <div class="ftb-champ-card__seasons">
                    <div class="ftb-champ-card__seasons-title">{translations.champ.seasons[userState.language]}:</div>
                    <div class="ftb-champ-card__seasons-value">{this.champ.seasons?.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ftb-link>
      </Host>
    );
  }
}
