import { Component, Host, h, Prop, State } from '@stencil/core';
import { Team } from 'ftb-models/dist/models/team.model';
import { translations } from 'ftb-models';
import userState from '@src/tools/user.store';
import sortBy from 'lodash-es/sortBy';

@Component({
  tag: 'ftb-player-team-card',
  styleUrl: 'ftb-player-team-card.component.scss',
  shadow: false,
})
export class FtbPlayerTeamCard {
  @Prop() data!: {
    from: any; //dayjs
    till: any; // dayjs
    team: Team;
    stats: { [key: string]: number };
  };
  @State() bg = [];
  @State() loaded = false;

  private onTeamColor(palette) {
    this.bg = [
      'linear-gradient(to right, rgba(' +
        [...palette[0], 1].join(', ') +
        '), rgba(' +
        [...palette[0], 0].join(', ') +
        ')',
      'linear-gradient(to right, rgba(' +
        [...palette[2], 0].join(', ') +
        '), rgba(' +
        [...palette[2], 1].join(', ') +
        ')',

      'rgba(' + [...palette[1], 1].join(', ') + ')',
    ];
    this.loaded = true;
  }

  render() {
    const statsPriority = ['played', 'goals', 'points', 'assists', 'points_per_game'];

    return (
      <Host>
        <ftb-link route="team" params={{ teamId: this.data.team._id, teamName: this.data.team.name }}>
          <div class={{ 'ftb-player-team-card__wrapper': true, 'loaded': this.loaded }}>
            <div class="ftb-player-team-card__background">
              <div class="ftb-player-team-card__color">
                <div class="ftb-player-team-card__color-layer" style={{ background: this.bg[0] }}></div>
                <div class="ftb-player-team-card__color-layer" style={{ background: this.bg[1] }}></div>
                <div class="ftb-player-team-card__color-layer" style={{ background: this.bg[2] }}></div>
              </div>
              <div class="ftb-player-team-card__content">
                <ftb-team-logo
                  team={this.data.team}
                  onColor={e => this.onTeamColor(e.detail)}
                  key={this.data.team._id}
                ></ftb-team-logo>
                <div class="ftb-player-team-card__name-period">
                  <div class="ftb-player-team-card__name">{this.data.team.name}</div>
                  <div class="ftb-player-team-card__stats">
                    {sortBy(Object.keys(this.data.stats), [k => statsPriority.findIndex(f => f == k)]).map(key => [
                      <div class="title">{translations.team.stats[key][userState.language]}: </div>,
                      <div class="val">{this.data.stats[key]}</div>,
                    ])}
                  </div>
                </div>
                <div class="ftb-player-team-card__period">
                  {this.data.till ? (
                    <div>
                      <div>{this.data.from.format('DD.MM.YYYY')}</div>-<div>{this.data.till.format('DD.MM.YYYY')}</div>
                    </div>
                  ) : (
                    <div>
                      {translations.transfers.since[userState.language]} {this.data.from.format('DD.MM.YYYY')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ftb-link>
      </Host>
    );
  }
}
