import { Component, Host, h, Prop, State } from '@stencil/core';
import { Season, translations, userState } from 'ftb-models';
import sortBy from 'lodash-es/sortBy';

@Component({
  tag: 'ftb-player-season-card',
  styleUrl: 'ftb-player-season-card.component.scss',
  shadow: false,
})
export class FtbPlayerSeasonCard {
  @Prop() data!: { season: Season; stats: { [key: string]: number } };
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
    const statsPriority = ['played', 'goals', 'points', 'assists', 'points_per_game'];

    return (
      <Host>
        <ftb-link
          route="season"
          params={{
            seasonId: this.data.season._id,
            tournamentName: this.data.season.champ.name + ' ' + this.data.season.name,
          }}
        >
          <div class="ftb-player-season-card__wrapper">
            <div class="ftb-player-season-card__background">
              <div class="ftb-player-season-card__color">
                <div class="ftb-player-season-card__color-layer" style={{ background: this.bg[0] }}></div>
                <div class="ftb-player-season-card__color-layer" style={{ background: this.bg[1] }}></div>
                <div class="ftb-player-season-card__color-layer" style={{ background: this.bg[2] }}></div>
              </div>
              <div class="ftb-player-season-card__content">
                <ftb-flag
                  flag={this.data.season.champ.country.flag}
                  onColor={e => this.onFlagColor(e.detail)}
                  key={this.data.season.country.flag}
                ></ftb-flag>
                <div class="ftb-player-season-card__data">
                  <div class="ftb-player-season-card__champ-name">
                    {this.data.season.champ.name} - {this.data.season.name}
                  </div>
                  <div class="ftb-player-season-card__stats">
                    <div class="ftb-player-season-card__stats">
                      {sortBy(Object.keys(this.data.stats), [k => statsPriority.findIndex(f => f == k)]).map(key => [
                        <div class="title">{translations.team.stats[key][userState.language]}: </div>,
                        <div class="val">{this.data.stats[key]}</div>,
                      ])}
                    </div>
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
