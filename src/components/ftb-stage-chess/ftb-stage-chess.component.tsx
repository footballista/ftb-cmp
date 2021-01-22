import { Component, h, Host, Prop, State } from '@stencil/core';
import { diState, GameState, Stage, translations, userState } from 'ftb-models';
import Chevron from '../../assets/icons/chevron-down.svg';
import ChampionsLeague from '../../assets/icons/champions-league.svg';
import EuropaLeague from '../../assets/icons/europa-league.svg';
import { StageService } from 'ftb-models/dist/services/stage.service';

@Component({
  tag: 'ftb-stage-chess',
  styleUrl: 'ftb-stage-chess.component.scss',
  shadow: false,
})
export class FtbStageChess {
  @Prop() stage!: Stage;
  @State() gamesLoaded: boolean;
  @State() structure: {
    label: boolean;
    position: boolean;
    shortName: boolean;
    name: boolean;
    games: boolean;
    wdl: boolean;
    wl: boolean;
    gd: boolean;
    points: boolean;
    form: boolean;
    winPercent: boolean;
  };

  componentWillLoad() {
    new StageService(diState.gql).loadStageGames(this.stage._id).then(s => {
      this.stage.games = s.games;
      this.gamesLoaded = true;
    });

    const structure = {
      label: false,
      position: true,
      shortName: false,
      name: false,
      games: true,
      wdl: true,
      wl: false,
      gd: false,
      points: true,
      form: true,
      winPercent: false,
    };
    // const W = {
    //   label: 10,
    //   position: 30,
    //   points: 35,
    //   games: 35,
    //   shortName: 65,
    //   fullName: 265,
    //   wdl: 45,
    //   wl: 45,
    //   winPercent: 35,
    //   gd: 75,
    //   form: 75,
    // };

    this.structure = structure;
  }

  render() {
    return (
      <Host>
        <div class="ftb-stage-chess__wrapper">
          <div class="ftb-stage-chess__background">
            <div class="head row">
              {this.structure.label && <div class="label"></div>}
              {this.structure.position && <div class="position"></div>}
              <div class="name"></div>
              {this.stage.table.map(row => (
                <div class="game-cell">
                  <ftb-team-logo team={row.team} key={row.team._id}></ftb-team-logo>
                </div>
              ))}
              {this.structure.games && <div class="games">{translations.standings.gms[userState.language]}</div>}
              {this.structure.wdl && <div class="wdl">{translations.standings.wdl[userState.language]}</div>}
              {this.structure.wl && <div class="wl">{translations.standings.wl[userState.language]}</div>}
              {this.structure.winPercent && (
                <div class="win-percent">{translations.standings.win_percent[userState.language]}</div>
              )}
              {this.structure.gd && <div class="gd">{translations.standings.gd[userState.language]}</div>}
              {this.structure.points && <div class="points">{translations.standings.pts[userState.language]}</div>}
              {this.structure.form && <div class="form">{translations.standings.form[userState.language]}</div>}
            </div>
            {this.stage.table.map((row, idx) => (
              <div class="row">
                {this.structure.label && (
                  <div class="label">
                    {row.label == 'chevron-up' && (
                      <div class="svg-container" innerHTML={Chevron} style={{ transform: 'rotate(180deg)' }}></div>
                    )}
                    {row.label == 'chevron-down' && <div class="svg-container" innerHTML={Chevron}></div>}
                    {row.label == 'champions-league' && <div class="svg-container" innerHTML={ChampionsLeague}></div>}
                    {row.label == 'europa-league' && <div class="svg-container" innerHTML={EuropaLeague}></div>}
                  </div>
                )}
                {this.structure.position && <div class="position">{row.position}</div>}
                <div class="name">
                  <ftb-team-logo team={row.team} key={row.team._id}></ftb-team-logo>
                  {row.team.name}
                </div>
                {this.stage.table.map((r, i) => (
                  <div class={{ 'game-cell': true, 'stub': r.position === row.position }}>
                    {this.renderDuels(idx, i)}
                  </div>
                ))}
                {this.structure.games && <div class="games">{row.games}</div>}
                {this.structure.wdl && (
                  <div class="wdl">
                    {row.w}-{row.d}-{row.l}
                  </div>
                )}
                {this.structure.wl && (
                  <div class="wl">
                    {row.w}-{row.l}
                  </div>
                )}
                {this.structure.gd && (
                  <div class="gd">
                    {row.scored}-{row.conceded}
                    <span class="diff">
                      {row.scored >= row.conceded && '+'}
                      {row.scored - row.conceded}
                    </span>
                  </div>
                )}
                {this.structure.points && <div class="points">{row.points}</div>}
                {this.structure.form && (
                  <div class="form">
                    {[5, 4, 3, 2, 1].map(idx => (
                      <i class={this.getFormClass(row, idx)}></i>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Host>
    );
  }

  private getFormClass(row, idx: number) {
    if (!row.form) return '';
    if (!row.form[row.form.length - idx]) return '';
    return row.form[row.form.length - idx];
  }

  private renderDuels(teamIdx: number, oppIdx: number) {
    if (!this.gamesLoaded) return;
    if (teamIdx === oppIdx) return;

    const teamId = this.stage.table[teamIdx].team._id;
    const oppId = this.stage.table[oppIdx].team._id;

    const games = this.stage.games.items
      .filter(g => g.state == GameState.CLOSED)
      .filter(
        g =>
          (g.home.team._id == teamId && g.away.team._id == oppId) ||
          (g.away.team._id == teamId && g.home.team._id == oppId),
      );

    return games.map(g => {
      const teamSide = g.home.team._id == teamIdx ? g.home : g.away;
      const opponentSide = g.home.team._id == teamIdx ? g.away : g.home;
      return (
        <ftb-link
          class={{ game: true, w: teamSide.isWinner, l: teamSide.isLoser, d: !teamSide.isWinner && !teamSide.isLoser }}
          route="game"
          params={{ gameId: g._id, gameTitle: g.home.team.name + ' - ' + g.away.team.name }}
        >
          <ftb-game-side-score game={g} side={teamSide}></ftb-game-side-score>:
          <ftb-game-side-score game={g} side={opponentSide}></ftb-game-side-score>
        </ftb-link>
      );
    });
  }
}
