import { Component, h, Host, Prop, State, Element } from '@stencil/core';
import { Stage, TableRow, translations, userState, diState, Sports, GameState } from 'ftb-models';
import ResizeObserver from 'resize-observer-polyfill';
import Chevron from '../../assets/icons/chevron-down.svg';
import ChampionsLeague from '../../assets/icons/champions-league.svg';
import EuropaLeague from '../../assets/icons/europa-league.svg';
import { StageService } from 'ftb-models/dist/services/stage.service';

@Component({
  tag: 'ftb-stage-table',
  styleUrl: 'ftb-stage-table.component.scss',
  shadow: false,
})
export class FtbStageTable {
  @Prop() stage!: Stage;
  @Prop() showChess: boolean;
  @Prop() customWidths: {
    label?: number;
    position?: number;
    points?: number;
    games?: number;
    chess?: number;
    name?: number;
    shortName?: number;
    fullName?: number;
    wdl?: number;
    wl?: number;
    winPercent?: number;
    gd?: number;
    form?: number;
  };
  @State() chessLoaded: boolean;
  @State() structure: {
    label: boolean;
    position: boolean;
    shortName: boolean;
    name: boolean;
    games: boolean;
    chess: boolean;
    wdl: boolean;
    wl: boolean;
    gd: boolean;
    points: boolean;
    form: boolean;
    winPercent: boolean;
  };
  @Element() el: HTMLElement;
  private resizeObserver: ResizeObserver;
  private W = {
    label: 10,
    position: 30,
    points: 45,
    games: 45,
    chess: 45,
    name: 90,
    shortName: 90,
    fullName: 250,
    wdl: 65,
    wl: 65,
    winPercent: 45,
    gd: 90,
    form: 90,
  };

  componentWillLoad() {
    this.W = Object.assign(this.W, this.customWidths);
    if (this.showChess) {
      new StageService(diState.gql).loadStageGames(this.stage._id).then(s => {
        this.stage.games = s.games;
        this.chessLoaded = true;
      });
    }
    this.resizeObserver = new ResizeObserver(() => {
      this.updateStructure();
    });
    this.resizeObserver.observe(this.el);
    this.updateStructure();
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  private updateStructure() {
    const structure = {
      label: false,
      position: true,
      shortName: true,
      name: false,
      games: true,
      chess: false,
      wdl: false,
      wl: false,
      gd: false,
      points: true,
      form: false,
      winPercent: false,
    };

    const containerWidth = this.el.clientWidth;
    const getTypeWidth = (key: string): number => {
      if (key == 'chess') return this.W[key] * this.stage.table.length;
      return this.W[key];
    };
    const currentWidth = () =>
      Object.keys(structure)
        .filter(k => structure[k])
        .reduce((sum, k) => sum + getTypeWidth(k), 0);
    const sports = this.stage.league.sports;

    structure.label = this.stage.table.some(t => t.label);
    if (sports == Sports.basketball) {
      structure.winPercent = currentWidth() + this.W.winPercent < containerWidth;
    }
    if ([Sports.football, Sports.water_polo].includes(sports)) {
      structure.wdl = currentWidth() + this.W.wdl < containerWidth;
    }
    if ([Sports.beach_soccer, Sports.volleyball, Sports.basketball].includes(sports)) {
      structure.wl = currentWidth() + this.W.wl < containerWidth;
    }
    structure.gd = currentWidth() + this.W.gd < containerWidth;

    if (this.showChess) {
      structure.chess = currentWidth() + getTypeWidth('chess') < containerWidth;
    }

    structure.form = currentWidth() + this.W.form < containerWidth;

    if (currentWidth() - this.W.shortName + this.W.fullName < containerWidth) {
      structure.name = true;
      structure.shortName = false;
    } else {
      structure.shortName = true;
      structure.name = false;
    }
    this.structure = structure;
  }

  render() {
    return (
      <Host>
        <div class="ftb-stage-table__wrapper">{this.structure ? [this.renderHead(), this.renderBody()] : null}</div>
      </Host>
    );
  }

  private renderHead() {
    return (
      <div class="ftb-stage-table__head">
        {this.structure.label && <div class="label" style={this.getFieldStyle('label')}></div>}
        {this.structure.position && <div class="position" style={this.getFieldStyle('position')}></div>}
        {this.structure.shortName && <div class="name" style={this.getFieldStyle('name')}></div>}
        {this.structure.name && (
          <div class="name" style={this.getFieldStyle('name')}>
            {this.stage.name}
          </div>
        )}
        {this.structure.chess &&
          this.stage.table.map(row => (
            <div class="chess-game" style={this.getFieldStyle('chess')}>
              <ftb-link route="team" params={{ teamId: row.team._id, teamName: row.team.name }}>
                <ftb-team-logo team={row.team} key={row.team._id}></ftb-team-logo>
              </ftb-link>
            </div>
          ))}
        {this.structure.games && (
          <div class="games" style={this.getFieldStyle('games')}>
            {translations.standings.gms[userState.language]}
          </div>
        )}
        {this.structure.wdl && (
          <div class="wdl" style={this.getFieldStyle('wdl')}>
            {translations.standings.wdl[userState.language]}
          </div>
        )}
        {this.structure.wl && (
          <div class="wl" style={this.getFieldStyle('wl')}>
            {translations.standings.wl[userState.language]}
          </div>
        )}
        {this.structure.winPercent && (
          <div class="win-percent" style={this.getFieldStyle('win-percent')}>
            {translations.standings.win_percent[userState.language]}
          </div>
        )}
        {this.structure.gd && (
          <div class="gd" style={this.getFieldStyle('gd')}>
            {translations.standings.gd[userState.language]}
          </div>
        )}
        {this.structure.points && (
          <div class="points" style={this.getFieldStyle('points')}>
            {translations.standings.pts[userState.language]}
          </div>
        )}
        {this.structure.form && (
          <div class="form" style={this.getFieldStyle('form')}>
            {translations.standings.form[userState.language]}
          </div>
        )}
      </div>
    );
  }

  private renderBody() {
    return (
      <div class="ftb-stage-table__body">
        {this.stage.table.map((row: TableRow, idx: number) => (
          <ftb-link route="team" params={{ teamId: row.team._id, teamName: row.team.name }}>
            <div class="ftb-stage-table__row">
              {this.structure.label && (
                <div class="label" style={this.getFieldStyle('label')}>
                  {row.label == 'chevron-up' && (
                    <div class="svg-container" innerHTML={Chevron} style={{ transform: 'rotate(180deg)' }}></div>
                  )}
                  {row.label == 'chevron-down' && <div class="svg-container" innerHTML={Chevron}></div>}
                  {row.label == 'champions-league' && <div class="svg-container" innerHTML={ChampionsLeague}></div>}
                  {row.label == 'europa-league' && <div class="svg-container" innerHTML={EuropaLeague}></div>}
                </div>
              )}
              {this.structure.position && (
                <div class="position" style={this.getFieldStyle('position')}>
                  {row.position}
                </div>
              )}
              {(this.structure.shortName || this.structure.name) && (
                <div class="name" style={this.getFieldStyle('name')}>
                  <ftb-team-logo team={row.team}></ftb-team-logo>
                  {this.structure.name === true ? row.team.name : row.team.shortName}
                </div>
              )}
              {this.structure.chess &&
                this.stage.table.map((r, i) => (
                  <div
                    class={{ 'chess-game': true, 'stub': r.position === row.position }}
                    style={this.getFieldStyle('chess')}
                  >
                    {this.renderDuels(idx, i)}
                  </div>
                ))}
              {this.structure.games && (
                <div class="games" style={this.getFieldStyle('games')}>
                  {row.games}
                </div>
              )}
              {this.structure.wdl && (
                <div class="wdl" style={this.getFieldStyle('wdl')}>
                  {row.w}-{row.d}-{row.l}
                </div>
              )}
              {this.structure.wl && (
                <div class="wl" style={this.getFieldStyle('wl')}>
                  {row.w}-{row.l}
                </div>
              )}
              {this.structure.gd && (
                <div class="gd" style={this.getFieldStyle('gd')}>
                  {row.scored}-{row.conceded}
                  <span class="diff">
                    {row.scored >= row.conceded && '+'}
                    {row.scored - row.conceded}
                  </span>
                </div>
              )}
              {this.structure.points && (
                <div class="points" style={this.getFieldStyle('points')}>
                  {row.points}
                </div>
              )}
              {this.structure.form && (
                <div class="form" style={this.getFieldStyle('form')}>
                  {[5, 4, 3, 2, 1].map(idx => (
                    <i class={this.getFormClass(row, idx)}></i>
                  ))}
                </div>
              )}
            </div>
          </ftb-link>
        ))}
      </div>
    );
  }

  private renderDuels(teamIdx: number, oppIdx: number) {
    if (!this.chessLoaded) return;
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

  private getFormClass(row, idx: number) {
    if (!row.form) return '';
    if (!row.form[row.form.length - idx]) return '';
    return row.form[row.form.length - idx];
  }

  private getFieldStyle(key: string) {
    return { 'min-width': this.W[key] + 'px' };
  }
}
