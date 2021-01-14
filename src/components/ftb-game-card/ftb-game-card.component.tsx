import { Component, Host, h, Prop } from '@stencil/core';
import { Game, GameSide, PlayerGame, translations, userState } from 'ftb-models';
import { FtbGameCardField } from './ftb-game-card-fields';

@Component({
  tag: 'ftb-game-card',
  styleUrl: 'ftb-game-card.component.scss',
  shadow: false,
})
export class FtbGameCard {
  @Prop() game!: Game;
  @Prop() playerStats: PlayerGame['stats'];
  @Prop() topFields: FtbGameCardField[] = [];
  @Prop() leftFields: FtbGameCardField[] = [];
  @Prop() rightFields: FtbGameCardField[] = [];
  @Prop() bottomFields: FtbGameCardField[] = [];

  componentWillLoad() {
    if (this.playerStats) {
      this.rightFields = [FtbGameCardField.playerStats];
    }
  }

  render() {
    return (
      <Host>
        <ftb-link
          route="game"
          params={{ gameId: this.game._id, gameTitle: this.game.home.team.name + ' ' + this.game.away.team.name }}
        >
          <div class="ftb-game-card__wrapper">
            <div class="ftb-game-card__background">
              {this.renderTop()}
              <div class="ftb-game-card__content">
                {this.renderLeft()}
                {this.renderCenter()}
                {this.renderRight()}
              </div>
              {this.renderBottom()}
            </div>
          </div>
        </ftb-link>
      </Host>
    );
  }

  private renderTop() {
    if (!this.topFields.length) return;
    return (
      <div class="ftb-game-card__top">
        {this.topFields.map(key => (
          <div class={key}>{this.getValueByKey(key)}</div>
        ))}
      </div>
    );
  }

  private renderLeft() {
    if (!this.leftFields.length) return;
    return (
      <div class="left">
        {this.leftFields.map(key => (
          <div class={key}>{this.getValueByKey(key)}</div>
        ))}
      </div>
    );
  }

  private renderRight() {
    if (!this.rightFields.length) return;
    return (
      <div class="right">
        {this.rightFields.map(key => (
          <div class={key}>{this.getValueByKey(key)}</div>
        ))}
      </div>
    );
  }

  private renderBottom() {
    if (!this.bottomFields.length) return;
    return (
      <div class="ftb-game-card__bottom">
        {this.bottomFields.map(key => (
          <div class={key}>{this.getValueByKey(key)}</div>
        ))}
      </div>
    );
  }

  private renderCenter() {
    return (
      <div class="center">
        {this.renderCenterRow(this.game.home)}
        {this.renderCenterRow(this.game.away)}
      </div>
    );
  }

  private renderCenterRow(side: GameSide) {
    return (
      <div class="center-row">
        <ftb-team-logo team={side.team} key={side.team._id}></ftb-team-logo>
        <div class="name">{side.team.shortName.toUpperCase()}</div>
        <ftb-game-side-score game={this.game} side={side}></ftb-game-side-score>
      </div>
    );
  }

  private getValueByKey(key) {
    if (key == FtbGameCardField.date) return <ftb-game-date game={this.game} withtime={false}></ftb-game-date>;
    if (key == FtbGameCardField.time) return this.game.date && this.game.date.format('HH:mm');
    if (key == FtbGameCardField.dateTime) return <ftb-game-date game={this.game}></ftb-game-date>;
    if (key == FtbGameCardField.pitch) return this.game.pitch && this.game.pitch.name;
    if (key == FtbGameCardField.stadium) return this.game.stadium && this.game.stadium.name;
    if (key == FtbGameCardField.champ) return this.game.champ.name;
    if (key == FtbGameCardField.season) return this.game.season.name;
    if (key == FtbGameCardField.champSeason) return this.game.champ.name + ' - ' + this.game.season.name;
    if (key == FtbGameCardField.round) return <ftb-game-tour game={this.game}></ftb-game-tour>;
    if (key == FtbGameCardField.playerStats) {
      if (!this.playerStats) return;
      return (
        <div class="player-stats">
          {this.playerStats.goals ? (
            <div class="item goals">
              <div class="title">{translations.team.stats.goals[userState.language]}</div>
              <div class="delimiter">:</div>
              <div class="value">{this.playerStats.goals}</div>
            </div>
          ) : null}
          {this.playerStats.assists ? (
            <div class="item assists">
              <div class="title">{translations.team.stats.assists[userState.language]}</div>
              <div class="delimiter">:</div>
              <div class="value">{this.playerStats.assists}</div>
            </div>
          ) : null}
          {this.playerStats.yellow ? <i class="card yellow"></i> : null}
          {this.playerStats.yellow == 2 ? <i class="card yellow"></i> : null}
          {this.playerStats.red ? <i class="card red"></i> : null}
        </div>
      );
    }
  }
}
