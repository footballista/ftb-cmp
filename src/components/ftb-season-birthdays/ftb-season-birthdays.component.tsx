import { Component, Host, h, Prop } from '@stencil/core';
import { Season, translations, userState, Player } from 'ftb-models';

@Component({
  tag: 'ftb-season-birthdays',
  styleUrl: 'ftb-season-birthdays.component.scss',
  shadow: false,
})
export class FtbSeasonBirthdays {
  @Prop() season!: Season;

  render() {
    if (!this.season.birthdays.length) return null;

    return (
      <Host>
        <div class="ftb-season-birthdays__wrapper">
          <div class="ftb-season-birthdays__background">
            <h2 class="component-header">{translations.champ.happy_birthday[userState.language]}</h2>
            <ftb-pagination
              totalItems={this.season.birthdays.length}
              items={this.season.birthdays}
              renderItem={(p: Player) => this.renderPlayer(p)}
              rows={2}
              itemMinWidthPx={266}
              itemHeightPx={75}
            ></ftb-pagination>
          </div>
        </div>
      </Host>
    );
  }

  private renderPlayer(p: Player) {
    return (
      <ftb-link route="player" params={{ playerId: p._id, playerName: p.firstName + ' ' + p.lastName }}>
        <div class="ftb-season-birthdays__player-wrapper">
          <div class="ftb-season-birthdays__player-background">
            <ftb-player-photo player={p} key={'player_' + p._id}></ftb-player-photo>
            <div class="ftb-season-birthdays__player-data">
              <div class="name">
                {p.firstName[0]}. {p.lastName}
              </div>
              <div class="age">
                {p.birthday.format('DD.MM.YYYY')} -{p.getAge()}{' '}
                {translations.player.y_o[userState.language].getForm(p.getAge())}
              </div>
            </div>
            <div class="ftb-season-birthdays__player-teams">
              {p.teams.map(t => (
                <ftb-team-logo team={t} key={'team_' + t._id}></ftb-team-logo>
              ))}
            </div>
          </div>
        </div>
      </ftb-link>
    );
  }
}
