import { Component, h, Host, Prop } from '@stencil/core';
import { Game, RoleLevel, translations, userState } from 'ftb-models';
import { FtbTeamLogoMode } from '@src/components/ftb-team-logo/ftb-team-logo-mode';
import groupBy from 'lodash-es/groupBy';
import WhistleIcon from '../../assets/icons/whistle.svg';
import PhotoIcon from '../../assets/icons/photo.svg';
import CameraIcon from '../../assets/icons/camera.svg';

@Component({
  tag: 'ftb-game-scoreboard',
  styleUrl: 'ftb-game-scoreboard.component.scss',
  shadow: false,
})
export class FtbGameScoreboard {
  @Prop() game!: Game;

  render() {
    return (
      <Host>
        <div class="ftb-game-scoreboard__wrapper">
          <div class="ftb-game-scoreboard__background">
            <div class="ftb-game-scoreboard__header">{this.renderHeader()}</div>
            <div class="ftb-game-scoreboard__content">{this.renderContent()}</div>
            <div class="ftb-game-scoreboard__footer">{this.renderFooter()}</div>
          </div>
        </div>
      </Host>
    );
  }

  private renderHeader() {
    return (
      <div class="header">
        <div class="date-time-stadium">
          <div class="date-time">
            <ftb-game-date game={this.game}></ftb-game-date>
          </div>
          <div class="stadium-pitch">
            <ftb-game-stadium game={this.game}></ftb-game-stadium>
          </div>
        </div>
        <div class="champ-tour">
          {this.game.champ.name} {this.game.season.name}, <ftb-game-tour game={this.game}></ftb-game-tour>
        </div>
      </div>
    );
  }

  private renderContent() {
    return (
      <div class="content">
        <div class="side home">
          <ftb-team-logo team={this.game.home.team} mode={FtbTeamLogoMode.middle}></ftb-team-logo>
          <div class="name">{this.game.home.team.name}</div>
        </div>
        <div class="state-score">
          <div class="score">
            <ftb-game-side-score game={this.game} side={this.game.home}></ftb-game-side-score>
            <div class="delimiter">:</div>
            <ftb-game-side-score game={this.game} side={this.game.away}></ftb-game-side-score>
          </div>
          <ftb-game-state game={this.game}></ftb-game-state>
        </div>
        <div class="side away">
          <ftb-team-logo team={this.game.away.team} mode={FtbTeamLogoMode.middle}></ftb-team-logo>
          <div class="name">{this.game.away.team.name}</div>
        </div>
      </div>
    );
  }

  private renderFooter() {
    const groupedStaff = groupBy(this.game.staff, 'role');
    const getIcon = (role: RoleLevel) => {
      if (role === RoleLevel.referee) return WhistleIcon;
      if (role === RoleLevel.photographer) return PhotoIcon;
      if (role === RoleLevel.operator) return CameraIcon;
    };
    return (
      <div class="footer">
        {[RoleLevel.referee, RoleLevel.photographer, RoleLevel.operator].map(key => {
          const group = groupedStaff[key];
          if (!group) return;
          const translationKey = group.length == 1 ? key : key + 's';
          return (
            <div class="person-group">
              <div class="role">{translations.role[translationKey][userState.language]}</div>
              <div class="role-icon">
                <ftb-icon svg={getIcon(key)}></ftb-icon>
              </div>
              <div class="delimiter">:</div>
              <div class="names">
                {group.map((s, idx) => (
                  <div class="name">
                    {s.user.name}
                    {idx + 1 < group.length && ', '}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
