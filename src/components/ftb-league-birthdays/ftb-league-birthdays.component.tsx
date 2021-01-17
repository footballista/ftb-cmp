import { Component, Host, h, Prop } from '@stencil/core';
import { League, translations, userState, diState, LeagueService, Player } from 'ftb-models';

@Component({
  tag: 'ftb-league-birthdays',
  styleUrl: 'ftb-league-birthdays.component.scss',
  shadow: false,
})
export class FtbLeagueBirthdays {
  @Prop() league!: League;

  async componentWillLoad() {
    const league = await new LeagueService(diState.gql).loadLeagueBirthdays(this.league._id);
    this.league.birthdays = league.birthdays;
  }

  render() {
    if (!this.league.birthdays.length) return null;

    return (
      <Host>
        <div class="ftb-league-birthdays__wrapper">
          <div class="ftb-league-birthdays__background">
            <h2 class="component-header">{translations.champ.happy_birthday[userState.language]}</h2>
            <ftb-pagination
              totalItems={this.league.birthdays.length}
              items={this.league.birthdays}
              renderItem={(p: Player) => this.renderPlayer(p)}
              rows={2}
              itemMinWidthPx={266}
              itemMinHeightPx={75}
            ></ftb-pagination>
          </div>
        </div>
      </Host>
    );
  }

  private renderPlayer(p: Player) {
    return (
      <ftb-link route="player" params={{ playerId: p._id, playerName: p.firstName + ' ' + p.lastName }}>
        <div class="ftb-league-birthdays__player-wrapper">
          <div class="ftb-league-birthdays__player-background">
            <ftb-player-photo player={p} key={'player_' + p._id}></ftb-player-photo>
            <div class="ftb-league-birthdays__player-data">
              <div class="name">
                {p.firstName[0]}. {p.lastName}
              </div>
              <div class="age">
                {p.birthday.format('DD.MM.YYYY')} -{p.getAge()}{' '}
                {translations.player.y_o[userState.language].getForm(p.getAge())}
              </div>
            </div>
            <div class="ftb-league-birthdays__player-teams">
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
