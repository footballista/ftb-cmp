import { Component, Host, h, Prop, State } from '@stencil/core';
import { Team, TransferRequest, translations, userState } from 'ftb-models';
@Component({
  tag: 'ftb-team-transfer-card',
  styleUrl: 'ftb-team-transfer-card.component.scss',
  shadow: false,
})
export class FtbTeamTransferCard {
  @Prop() transfer: TransferRequest;
  @Prop() team: Team;
  @State() loaded: boolean;

  render() {
    return (
      <Host>
        <ftb-link
          route="player"
          params={{
            playerId: this.transfer.player._id,
            playerName: this.transfer.player.firstName + ' ' + this.transfer.player.lastName,
          }}
        >
          <div class={{ 'ftb-team-transfer-card__wrapper': true, 'loaded': this.loaded }}>
            <div class="ftb-team-transfer-card__background">
              <div class="photo">
                <ftb-player-photo
                  player={this.transfer.player}
                  key={this.transfer.player._id}
                  onLoaded={() => (this.loaded = true)}
                ></ftb-player-photo>
              </div>
              <div class="info">
                <div class="name">
                  {this.transfer.player.firstName} {this.transfer.player.lastName}
                </div>
                <div class="type">
                  {translations.transfers.types[this.transfer.type][userState.language]}
                  {this.transfer.fromTeam?._id && this.transfer.fromTeam._id != this.team._id && (
                    <span>
                      {translations.transfers.direction.from[userState.language]}
                      <ftb-team-logo team={this.transfer.fromTeam}></ftb-team-logo>
                    </span>
                  )}
                  {this.transfer.toTeam?._id && this.transfer.toTeam._id != this.team._id && (
                    <span>
                      {translations.transfers.direction.to[userState.language]}
                      <ftb-team-logo team={this.transfer.toTeam}></ftb-team-logo>
                    </span>
                  )}
                </div>
              </div>
              <div class="date-time">
                <div class="date">{this.transfer.adminConfirmedDate.format('DD.MM.YYYY')}</div>
                <div class="time">{this.transfer.adminConfirmedDate.format('HH:mm')}</div>
              </div>
            </div>
          </div>
        </ftb-link>
      </Host>
    );
  }
}
