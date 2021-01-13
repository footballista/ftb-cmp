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
    return (
      <Host>
        <ftb-link route="team" params={{ teamId: this.team._id, teamName: this.team.name }}>
          <div class={{ 'ftb-team-card__wrapper': true, 'loaded': this.loaded }}>
            <div class="ftb-team-card__background">
              <div class="ftb-team-card__color">
                <div class="ftb-team-card__color-layer" style={{ background: this.bg[0] }}></div>
                <div class="ftb-team-card__color-layer" style={{ background: this.bg[1] }}></div>
                <div class="ftb-team-card__color-layer" style={{ background: this.bg[2] }}></div>
              </div>
              <div class="ftb-team-card__content">
                <ftb-team-logo team={this.team} onColor={e => this.onTeamColor(e.detail)}></ftb-team-logo>
                <div class="ftb-team-card__name-rating">
                  <div class="ftb-team-card__name">{this.team.name}</div>
                  <div class="ftb-team-card__rating">{this.team.rating}</div>
                </div>
              </div>
            </div>
          </div>
        </ftb-link>
      </Host>
    );
  }
}
