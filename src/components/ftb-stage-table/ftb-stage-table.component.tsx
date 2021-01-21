import { Component, h, Host, Prop, State } from '@stencil/core';
import { Stage, TableRow, translations, userState, Sports } from 'ftb-models';
import ResizeObserver from 'resize-observer-polyfill';
import Chevron from '../../assets/icons/chevron-down.svg';
import ChampionsLeague from '../../assets/icons/champions-league.svg';
import EuropaLeague from '../../assets/icons/europa-league.svg';

@Component({
  tag: 'ftb-stage-table',
  styleUrl: 'ftb-stage-table.component.scss',
  shadow: false,
})
export class FtbStageTable {
  @Prop() stage!: Stage;
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
  private element: HTMLElement;
  private resizeObserver: ResizeObserver;

  componentDidLoad() {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateStructure();
    });
    this.resizeObserver.observe(this.element);
    this.updateStructure();
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  private updateStructure() {
    const structure = {
      label: false,
      position: true,
      shortName: false,
      name: false,
      games: true,
      wdl: false,
      wl: false,
      gd: false,
      points: true,
      form: false,
      winPercent: false,
    };

    const W = {
      label: 10,
      position: 30,
      points: 35,
      games: 35,
      shortName: 65,
      fullName: 265,
      wdl: 45,
      wl: 45,
      winPercent: 35,
      gd: 75,
      form: 75,
    };
    const style = window.getComputedStyle(this.element);
    const paddingLeft = parseInt(style['padding-left']);
    const paddingRight = parseInt(style['padding-right']);
    const containerWidth = this.element.offsetWidth - paddingLeft - paddingRight;
    const currentWidth = () =>
      Object.keys(structure)
        .filter(k => structure[k])
        .reduce((sum, k) => sum + W[k], 0);
    const sports = this.stage.league.sports;

    structure.label = this.stage.table.some(t => t.label);
    if (sports == Sports.basketball) {
      structure.winPercent = currentWidth() + W.winPercent < containerWidth;
    }
    if ([Sports.football, Sports.water_polo].includes(sports)) {
      structure.wdl = currentWidth() + W.wdl < containerWidth;
    }
    if ([Sports.beach_soccer, Sports.volleyball, Sports.basketball]) {
      structure.wl = currentWidth() + W.wl < containerWidth;
    }
    structure.gd = currentWidth() + W.gd < containerWidth;
    structure.form = currentWidth() + W.form < containerWidth;
    if (currentWidth() - W.shortName + W.fullName < containerWidth) {
      structure.name = true;
    } else {
      structure.shortName = true;
    }
    this.structure = structure;
  }

  render() {
    return (
      <Host>
        <div class="ftb-stage-table__wrapper">
          <div class="ftb-stage-table__background" ref={el => (this.element = el)}>
            {this.structure ? [this.renderHead(), this.renderBody()] : null}
          </div>
        </div>
      </Host>
    );
  }

  private renderHead() {
    return (
      <div class="ftb-stage-table__head">
        {this.structure.label && <div class="label"></div>}
        {this.structure.position && <div class="position">{translations.standings.pos[userState.language]}</div>}
        {(this.structure.shortName || this.structure.name) && (
          <div class="name">{translations.standings.name[userState.language]}</div>
        )}
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
    );
  }

  private renderBody() {
    return (
      <div class="ftb-stage-table__body">
        {this.stage.table.map((row: TableRow) => (
          <ftb-link route="team" params={{ teamId: row.team._id, teamName: row.team.name }}>
            <div class="ftb-stage-table__row">
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
              {(this.structure.shortName || this.structure.name) && (
                <div class="name">
                  <ftb-team-logo team={row.team}></ftb-team-logo>
                  {this.structure.name ? row.team.name : row.team.shortName}
                </div>
              )}
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
          </ftb-link>
        ))}
      </div>
    );
  }

  private getFormClass(row, idx: number) {
    if (!row.form) return '';
    if (!row.form[row.form.length - idx]) return '';
    return row.form[row.form.length - idx];
  }
}
