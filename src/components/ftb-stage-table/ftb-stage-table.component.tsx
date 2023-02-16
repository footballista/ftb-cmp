import { Component, h, Host, Prop, State, Element, Build } from '@stencil/core';
import { Stage, TableRow, translations, userState, GameState, Team, createEntityRoute, routingState } from 'ftb-models';
import Chevron from '../../assets/icons/chevron-down.svg';
import ChampionsLeague from '../../assets/icons/champions-league.svg';
import EuropaLeague from '../../assets/icons/europa-league.svg';
import { StageService } from 'ftb-models/dist/services/stage.service';
import { href } from 'stencil-router-v2';
import range from 'lodash-es/range';
import sortBy from 'lodash-es/sortBy';

@Component({
  tag: 'ftb-stage-table',
  styleUrl: 'ftb-stage-table.component.scss',
  shadow: false,
})
export class FtbStageTable {
  @Prop() stage!: Stage;
  @Prop() showChess?: boolean;
  @Prop() customWidths?: {
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

  /** you can render only a LIMIT of rows. Component defines which rows to render base on "baseTeam" parameter.
   *  If base team not provided or not found, top of the table will be rendered */
  @Prop() rowsLimit: { baseTeam?: Team; baseTeams?: Team[]; limit: number };

  @State()
  chessLoaded: boolean;
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
  private resizeObserver;
  private W = {
    label: 10,
    position: 30,
    points: 60,
    games: 60,
    chess: 45,
    name: 90,
    shortName: 90,
    fullName: 250,
    wdl: 75,
    wl: 65,
    winPercent: 45,
    gd: 90,
    form: 90,
  };

  componentWillLoad() {
    if (!this.stage) return;
    this.W = Object.assign(this.W, this.customWidths);
    if (this.showChess) {
      new StageService().loadStageGames(this.stage._id).then(s => {
        this.stage.games = s.games;
        this.chessLoaded = true;
      });
    }

    this.updateStructure();
  }

  connectedCallback() {
    if (!this.stage) return;
    if (Build.isBrowser) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateStructure();
      });
      this.resizeObserver.observe(this.el);
    }
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
      wdl: true,
      wl: false,
      gd: true,
      points: true,
      form: false,
      winPercent: false,
    };

    // код внизу - валидный, но лень в нём разбираться, тк либа уже нигде не будет использоваться. хардкодим структуру чтобы показывать только вид для мобилки в футболе

    // const containerWidth = this.el.clientWidth;
    // const getTypeWidth = (key: string): number => {
    //   if (key == 'chess') return this.W[key] * this.stage.table.length;
    //   return this.W[key];
    // };
    // const currentWidth = () =>
    //   Object.keys(structure)
    //     .filter(k => structure[k])
    //     .reduce((sum, k) => sum + getTypeWidth(k), 0);
    // const sports = this.stage.league.sports;
    //
    // structure.label = this.stage.table.some(t => t.label);
    // if (sports == Sports.basketball) {
    //   structure.winPercent = currentWidth() + this.W.winPercent < containerWidth;
    // }
    // if ([Sports.football, Sports.water_polo].includes(sports)) {
    //   structure.wdl = currentWidth() + this.W.wdl < containerWidth;
    // }
    // if ([Sports.beach_soccer, Sports.volleyball, Sports.basketball].includes(sports)) {
    //   structure.wl = currentWidth() + this.W.wl < containerWidth;
    // }
    // structure.gd = currentWidth() + this.W.gd < containerWidth;
    //
    // if (this.showChess) {
    //   structure.chess = currentWidth() + getTypeWidth('chess') < containerWidth;
    // }
    //
    // structure.form = currentWidth() + this.W.form < containerWidth;
    //
    // if (currentWidth() - this.W.shortName + this.W.fullName < containerWidth) {
    //   structure.name = true;
    //   structure.shortName = false;
    // } else {
    //   structure.shortName = true;
    //   structure.name = false;
    // }
    this.structure = structure;
  }

  render() {
    if (!this.stage) return;

    return (
      <Host>
        <div class="ftb-stage-table__wrapper">{this.structure ? [this.renderHead(), this.renderBody()] : null}</div>
      </Host>
    );
  }

  private renderHead() {
    console.log(this.structure);
    return (
      <div class="head">
        {this.structure.label && <div class="label" style={this.getFieldStyle('label')} />}
        {this.structure.position && <div class="position" style={this.getFieldStyle('position')} />}
        <div class="name" style={this.getFieldStyle('name')}>
          {translations.team.team[userState.language]}
        </div>
        {this.structure.chess &&
          this.stage.table.map(row => (
            <div class="chess-game" style={this.getFieldStyle('chess')}>
              <a {...(routingState.routes.team && href(createEntityRoute(row.team)))}>
                <ftb-team-logo team={row.team} key={row.team._id} />
              </a>
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
    const displayingPositions = new Set<number>();

    const getPositions = (baseTeam: Team) => {
      let sliceStart;
      let sliceEnd;
      if (!baseTeam || !this.stage.table.some(row => row.team._id == baseTeam._id)) {
        sliceStart = 0;
        sliceEnd = this.rowsLimit.limit;
        if (this.stage.table.length - 1 === sliceEnd) sliceEnd++; //showing full table if only one row left
      } else {
        const basePosition = this.stage.table.findIndex(row => row.team._id == baseTeam._id);
        sliceStart = Math.round(Math.max(0, basePosition - this.rowsLimit.limit / 2));
        sliceEnd = Math.min(sliceStart + this.rowsLimit.limit, this.stage.table.length);
        sliceStart = sliceEnd - this.rowsLimit.limit;
      }
      return range(sliceStart, sliceEnd);
    };

    if (this.rowsLimit && this.rowsLimit.limit < this.stage.table.length) {
      if (this.rowsLimit?.baseTeam) {
        getPositions(this.rowsLimit.baseTeam).forEach(p => displayingPositions.add(p));
      }
      if (this.rowsLimit?.baseTeams?.length) {
        this.rowsLimit.baseTeams.map(team => {
          getPositions(team).forEach(p => displayingPositions.add(p));
        });
      }
    }

    const displayingRows = displayingPositions.size
      ? sortBy(Array.from(displayingPositions)).map(idx => this.stage.table[idx])
      : this.stage.table;

    const getTableRowClass = (row: TableRow) => {
      let rowClass = 'row ';
      let highlightedIdx = -1;
      if (this.rowsLimit?.baseTeam?._id == row.team._id) {
        highlightedIdx = 0;
      } else if (this.rowsLimit?.baseTeams) {
        highlightedIdx = this.rowsLimit.baseTeams.findIndex(t => t._id == row.team._id);
      }
      if (highlightedIdx != -1) {
        rowClass += 'base-team highlighted-' + highlightedIdx;
      }
      return rowClass;
    };

    const hasGap = (row, idx) => {
      if (!displayingRows[idx - 1]) {
        return false;
      } else if (displayingRows[idx - 1].position == row.position - 1) {
        return false;
      } else {
        return true;
      }
    };

    return (
      <div class="body">
        {displayingRows.map((row: TableRow, idx: number) => [
          hasGap(row, idx) ? <div class="gap" /> : null,
          <a {...(routingState.routes.team && href(createEntityRoute(row.team)))}>
            <div class={getTableRowClass(row)}>
              {this.structure.label && (
                <div class="label" style={this.getFieldStyle('label')}>
                  {row.label == 'chevron-up' && (
                    <div class="svg-container" innerHTML={Chevron} style={{ transform: 'rotate(180deg)' }} />
                  )}
                  {row.label == 'chevron-down' && <div class="svg-container" innerHTML={Chevron} />}
                  {row.label == 'champions-league' && <div class="svg-container" innerHTML={ChampionsLeague} />}
                  {row.label == 'europa-league' && <div class="svg-container" innerHTML={EuropaLeague} />}
                </div>
              )}
              {this.structure.position && (
                <div class="position" style={this.getFieldStyle('position')}>
                  {row.position}
                </div>
              )}
              {(this.structure.shortName || this.structure.name) && (
                <div class="name" style={this.getFieldStyle('name')}>
                  <ftb-team-logo team={row.team} />
                  <div class="team-name">{this.structure.name === true ? row.team.name : row.team.shortName}</div>
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
                    <i class={this.getFormClass(row, idx)} />
                  ))}
                </div>
              )}
            </div>
          </a>,
        ])}
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
        <a
          {...(routingState.routes.game && href(createEntityRoute(g)))}
          class={{ game: true, w: teamSide.isWinner, l: teamSide.isLoser, d: !teamSide.isWinner && !teamSide.isLoser }}
        >
          {teamSide.score.ft}:{opponentSide.score.ft}
        </a>
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
