import { Component, Host, h, Prop, State } from '@stencil/core';
import { Game } from 'ftb-models';
@Component({
  tag: 'ftb-game-photo-cover',
  styleUrl: 'ftb-game-photo-cover.component.scss',
  shadow: false,
})
export class FtbGamePhotoCover {
  @Prop() game!: Game;
  @State() loaded: boolean;

  render() {
    return (
      <Host>
        <ftb-link
          route="game"
          params={{ gameId: this.game._id, gameTitle: this.game.home.team.name + ' ' + this.game.away.team.name }}
        >
          <div class="ftb-game-photo-cover__wrapper">
            <div class={{ 'ftb-game-photo-cover__background': true, 'loaded': this.loaded }}>
              <div
                class="ftb-game-photo-cover__image"
                style={{ 'background-image': this.loaded ? `url('${this.game.photoset.cover}')` : 'unset' }}
              ></div>
              <div class="ftb-game-photo-cover__logos">
                <ftb-team-logo team={this.game.home.team}></ftb-team-logo>
                <ftb-team-logo team={this.game.away.team}></ftb-team-logo>
              </div>
              <div class="ftb-game-photo-cover__title">
                {this.game.home.team.name} - {this.game.away.team.name}
              </div>
            </div>
          </div>
          <img
            src={this.game.photoset.cover}
            onLoad={() => (this.loaded = true)}
            class="ftb-game-photo-cover__helper-img"
          />
        </ftb-link>
      </Host>
    );
  }
}
