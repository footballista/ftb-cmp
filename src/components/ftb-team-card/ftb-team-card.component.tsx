import { Component, Host, h, Prop, State } from '@stencil/core';
import { Team } from 'ftb-models/dist/models/team.model';
@Component({
  tag: 'ftb-team-card',
  styleUrl: 'ftb-team-card.component.scss',
  shadow: false,
})
export class FtbLeagueTeamCard {
  @Prop() team!: Team;
  @State() bg = [];
  @State() loaded = false;

  private onTeamColor(palette) {
    this.bg = [
      'linear-gradient(to right, rgba(' +
        [...palette[0], 0.3].join(', ') +
        '), rgba(' +
        [...palette[0], 0.15].join(', ') +
        ')',
      'linear-gradient(to right, rgba(' +
        [...palette[2], 0.15].join(', ') +
        '), rgba(' +
        [...palette[2], 0.3].join(', ') +
        ')',

      'rgba(' + [...palette[1], 0.25].join(', ') + ')',
    ];
    this.loaded = true;
  }

  render() {
    return (
      <Host>
        <div class={{ 'ftb-team-card__wrapper': true, 'loaded': this.loaded }} style={{ background: this.bg[0] }}>
          <div class="ftb-team-card__background" style={{ background: this.bg[1] }}>
            <ftb-team-logo team={this.team} onColor={e => this.onTeamColor(e.detail)}></ftb-team-logo>
            <div class="name-rating">
              <div class="name">{this.team.name}</div>
              <div class="rating">{this.team.rating}</div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
