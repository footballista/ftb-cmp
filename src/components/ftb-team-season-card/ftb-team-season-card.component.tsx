import { Component, h, Host, Prop, State } from '@stencil/core';
import {
  diState,
  Game,
  Season,
  SeasonService,
  Sports,
  Stage,
  StageFormat,
  TableRow,
  Team,
  translations,
  userState,
} from 'ftb-models';
import sortBy from 'lodash-es/sortBy';

@Component({
  tag: 'ftb-team-season-card',
  styleUrl: 'ftb-team-season-card.component.scss',
  shadow: false,
})
export class FtbTeamSeasonCard {
  @Prop() season!: Season;
  @Prop() team!: Team;
  @State() bg = [];
  @State() flagLoaded: boolean;
  @State() statsLoaded: boolean;
  @State() stagesStats: Array<{
    stage: Stage;
    position?: number;
    lastGame?: Game;
    w: number;
    d: number;
    l: number;
    scored: number;
    conceded: number;
  }> = [];

  componentWillLoad() {
    new SeasonService(diState.gql).loadSeasonStandings(this.season._id).then(s => {
      this.season.champ = s.champ;
      this.stagesStats = [];
      sortBy(s.stages, ['sortIdx']).forEach(st => {
        if (st.format === StageFormat.league && st.table.some(row => row.team._id == this.team._id)) {
          const tableRow: TableRow = st.table.find(row => row.team._id == this.team._id);
          this.stagesStats.push({
            stage: st,
            position: tableRow.position,
            w: tableRow.w,
            d: tableRow.d,
            l: tableRow.l,
            scored: tableRow.scored,
            conceded: tableRow.conceded,
          });
        } else if (
          st.format === StageFormat.cup &&
          st.cupNet.some(g => g.home.team._id == this.team._id || g.away.team._id == this.team._id)
        ) {
          const stats: any = {
            stage: st,
            w: 0,
            d: 0,
            l: 0,
            scored: 0,
            conceded: 0,
          };
          st.cupNet.forEach((g: Game) => {
            if (g.home.team._id === this.team._id) {
              stats.scored += g.home.score.ft;
              stats.conceded += g.away.score.ft;
              if (g.home.isWinner) {
                stats.w++;
              } else if (g.home.isLoser) {
                stats.l++;
              } else {
                stats.d++;
              }
              stats.lastGame = Object.assign(g, { stage: st });
            } else if (g.away.team._id === this.team._id) {
              stats.scored += g.away.score.ft;
              stats.conceded += g.home.score.ft;
              if (g.away.isWinner) {
                stats.w++;
              } else if (g.away.isLoser) {
                stats.l++;
              } else {
                stats.d++;
              }
              stats.lastGame = Object.assign(g, { stage: st });
            }
          });
          this.stagesStats.push(stats);
        }
      });

      this.statsLoaded = true;
    });
  }

  private onFlagColor(palette) {
    this.bg = [
      'linear-gradient(to right, rgba(' +
        [...palette[0], 1].join(', ') +
        '), rgba(' +
        [...palette[0], 0].join(', ') +
        '))',
      'linear-gradient(to right, rgba(' +
        [...palette[2], 0].join(', ') +
        '), rgba(' +
        [...palette[2], 1].join(', ') +
        '))',

      'rgba(' + [...palette[1], 1].join(', ') + ')',
    ];
    this.flagLoaded = true;
  }

  render() {
    return (
      <Host>
        <ftb-link
          route="season"
          params={{
            seasonId: this.season._id,
            tournamentName: this.season.champ.name + ' - ' + this.season.name,
          }}
        >
          <div
            class={{
              'ftb-team-season-card__wrapper': true,
              'flag-loaded': this.flagLoaded,
              'stats-loaded': this.statsLoaded,
            }}
          >
            <div class="ftb-team-season-card__background">
              <div class="ftb-team-season-card__color">
                <div class="ftb-team-season-card__color-layer" style={{ background: this.bg[0] }}></div>
                <div class="ftb-team-season-card__color-layer" style={{ background: this.bg[1] }}></div>
                <div class="ftb-team-season-card__color-layer" style={{ background: this.bg[2] }}></div>
              </div>
              <div class="ftb-team-season-card__content">
                <ftb-flag
                  flag={this.season.champ.country.flag}
                  onColor={e => this.onFlagColor(e.detail)}
                  key={this.season.champ.country.flag}
                  class="country-flag"
                ></ftb-flag>
                <div class="country-name">{this.season.champ.country.name}</div>
                <div class="season-name">
                  {this.season.champ.name} - {this.season.name}
                </div>
                <div class="loader-indicator">
                  <ftb-spinner></ftb-spinner>
                </div>

                <div class="stats-wrapper">
                  {this.stagesStats.map(stats => (
                    <div class="stage-stats">
                      {this.stagesStats.length > 1 && <div class="stage-name">{stats.stage.name}</div>}
                      {stats.stage.format === StageFormat.league
                        ? this.renderLeagueStagePlace(stats)
                        : this.renderCupStagePlace(stats)}
                      {this.renderWdlRow(stats)}
                      {this.renderGdRow(stats)}
                    </div>
                  ))}
                  <div class="season-status">{translations.champ.champ_is_finished[userState.language]}</div>
                </div>
              </div>
            </div>
          </div>
        </ftb-link>
      </Host>
    );
  }

  private renderLeagueStagePlace(stats) {
    return (
      <div class="param">
        <div class="value">
          {translations.standings.place[userState.language]}: {stats.position}
        </div>
      </div>
    );
  }

  private renderCupStagePlace(stats) {
    return (
      <div class="param">
        <div class="value">
          <ftb-game-tour game={stats.lastGame}></ftb-game-tour>
        </div>
      </div>
    );
  }

  private renderWdlRow(stats) {
    return [Sports.football, Sports.water_polo].includes(this.season.league.sports) ? (
      <div class="param">
        <div class="label">{translations.standings.wdl[userState.language]}</div>
        <div class="value">
          {stats.w}-{stats.d}-{stats.l}
        </div>
      </div>
    ) : (
      <div class="param">
        <div class="label">{translations.standings.wl[userState.language]}:</div>
        <div class="value">
          {stats.w}-{stats.l}
        </div>
      </div>
    );
  }

  private renderGdRow(stats) {
    return (
      <div class="param">
        <div class="label">{translations.standings.gd[userState.language]}</div>
        <div class="value gd">
          {stats.scored}-{stats.conceded}:
          <span class="diff">
            {stats.scored >= stats.conceded && '+'}
            {stats.scored - stats.conceded}
          </span>
        </div>
      </div>
    );
  }
}
