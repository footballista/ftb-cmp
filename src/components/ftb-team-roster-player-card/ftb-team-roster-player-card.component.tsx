import { Component, Host, h, Prop, State } from '@stencil/core';
import { Player, Team, translations, userState } from 'ftb-models';
@Component({
  tag: 'ftb-team-roster-player-card',
  styleUrl: 'ftb-team-roster-player-card.component.scss',
  shadow: false,
})
export class FtbTeamRosterPlayerCard {
  @Prop() player!: Player;
  @Prop() team!: Team;
  @State() loaded: boolean;

  render() {
    return (
      <Host>
        <ftb-link
          route="player"
          params={{
            playerId: this.player._id,
            playerName: this.player.firstName + ' ' + this.player.lastName,
          }}
        >
          <div class={{ 'ftb-team-roster-player-card__wrapper': true, 'loaded': this.loaded }}>
            <div class="ftb-team-roster-player-card__background">
              <div class="photo">
                <ftb-player-photo
                  player={this.player}
                  key={this.player._id}
                  onLoaded={() => (this.loaded = true)}
                ></ftb-player-photo>
              </div>

              <div class="info">
                <div class="name">
                  <div class="last-name">{this.player.lastName}</div>
                  <div class="first-name">{this.player.firstName}</div>
                  <div class="middle-name">{this.player.middleName}</div>
                </div>
                <div class="age">
                  {this.player.getAge() || '--'}{' '}
                  {translations.player.y_o[userState.language].getForm(this.player.getAge() || 0)}
                </div>
              </div>
              {this.player.teams.length > 1 && (
                <div class="teams">
                  {this.player.teams
                    .filter(t => t._id != this.team._id)
                    .map(t => (
                      <div class="team">
                        <ftb-team-logo
                          team={t}
                          caption={translations.player.also_playing_in[userState.language] + ' ' + t.name}
                        ></ftb-team-logo>
                      </div>
                    ))}
                </div>
              )}

              <div class="position">{this.player.position}</div>
              <div class="number">#{this.player.number}</div>
            </div>
          </div>
        </ftb-link>
      </Host>
    );
  }
}
