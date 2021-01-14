import { Component, h, Host, Prop, State } from '@stencil/core';
import { Game, GameSide, GameState, translations, GameService, userState, Team, diState } from 'ftb-models';
import { FtbGameCardField } from '../ftb-game-card/ftb-game-card-fields';

@Component({
  tag: 'ftb-game-stats-preview',
  styleUrl: 'ftb-game-stats-preview.component.scss',
  shadow: false,
})
export class FtbGameStatsPreview {
  @Prop() game!: Game;
  @State() loaded: boolean;

  componentWillLoad() {
    new GameService(diState.gql).loadGamePreview(this.game._id).then(g => {
      this.game.home ??= g.home;
      for (const key in g.home) {
        this.game.home[key] = g.home[key];
      }
      this.game.away ??= g.away;
      for (const key in g.away) {
        this.game.away[key] = g.away[key];
      }

      this.game.stage.table = g.stage.table;
      this.game.previousDuels = g.previousDuels;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-game-stats-preview__wrapper">
          {this.loaded ? this.renderTabs() : <ftb-spinner class="loader"></ftb-spinner>}
        </div>
      </Host>
    );
  }

  private renderTabs() {
    const tabs = [
      {
        renderTitle: () => translations.game.stats_preview[userState.language],
        renderContent: () => this.renderStats(),
      },
    ];
    if (this.game.previousDuels.length) {
      tabs.push({
        renderTitle: () => translations.game.duels_history[userState.language],
        renderContent: () => this.renderHistory(),
      });
    }

    return <ftb-tabs tabs={tabs}></ftb-tabs>;
  }

  private renderStats() {
    return (
      <div class="stats">
        <div class="row">
          {this.renderSeasonStats(this.game.home.team)}
          <div class="center">{translations.game.preview.season_stats[userState.language]}</div>
          {this.renderSeasonStats(this.game.away.team)}
        </div>
        <div class="row">
          {this.renderOverallStats(this.game.home.team)}
          <div class="center">{translations.game.preview.overall_stats[userState.language]}</div>
          {this.renderOverallStats(this.game.away.team)}
        </div>
        <div class="row">
          {this.renderDuelStats(this.game.home)}
          <div class="center">{translations.game.preview.duels[userState.language]}</div>
          {this.renderDuelStats(this.game.away)}
        </div>
        <div class="row last-games">
          {this.renderLastGames(this.game.home.team)}
          <div class="center">{translations.game.preview.last_5_games[userState.language]}</div>
          {this.renderLastGames(this.game.away.team)}
        </div>
      </div>
    );
  }

  private renderSeasonStats(team: Team) {
    const teamStats = this.game.stage.table.find(t => t._id == team._id);

    if (!teamStats) {
      return <div class="side">{translations.team.no_stats_yet[userState.language]}</div>;
    }

    return (
      <div class="side">
        <div class="item">
          <div class="title">{translations.standings.place[userState.language]}:</div>
          <div class="value">{teamStats.position}</div>
        </div>
        <div class="item">
          <div class="title">{translations.standings.wdl[userState.language]}:</div>
          <div class="value">
            {teamStats.w}-{teamStats.d}-{teamStats.l}
          </div>
        </div>
        <div class="item">
          <div class="title">{translations.standings.gd[userState.language]}</div>
          <div class="value">
            {teamStats.scored}-{teamStats.conceded}
          </div>
        </div>
      </div>
    );
  }

  private renderOverallStats(team: Team) {
    return (
      <div class="side">
        <div class="item">
          <div class="title">{translations.team.rating[userState.language]}:</div>
          <div class="value">{team.rating}</div>
        </div>
        <div class="item">
          <div class="title">{translations.standings.wdl[userState.language]}:</div>
          <div class="value">
            {team.stats.won}-{team.stats.draw}-{team.stats.lost}
          </div>
        </div>
        <div class="item">
          <div class="title">{translations.standings.gd[userState.language]}</div>
          <div class="value">
            {team.stats.scored}-{team.stats.conceded}
          </div>
        </div>
      </div>
    );
  }

  private renderLastGames(team: Team) {
    return (
      <div class="side">
        {team.games.items
          .filter(g => g.state == GameState.CLOSED)
          .slice(0, 5)
          .reverse()
          .map(g => this.renderMiniGame(g, team))}
      </div>
    );
  }

  private renderMiniGame(g: Game, team: Team) {
    const opponent = g.home.team._id === team._id ? g.away.team : g.home.team;
    const scoreFt =
      g.home.team._id === team._id ? [g.home.score.ft, g.away.score.ft] : [g.away.score.ft, g.home.score.ft];
    const scorePen =
      g.home.team._id === team._id ? [g.home.score.pen, g.away.score.pen] : [g.away.score.pen, g.home.score.pen];
    const hasPen = scorePen[0] > 0 || scorePen[1] > 0;
    return (
      <ftb-link route="game" params={{ game: g._id, gameTitle: g.home.team.name + ' - ' + g.away.team.name }}>
        <div class="mini-score">
          <ftb-team-logo team={opponent}></ftb-team-logo>
          <div class="score">
            {scoreFt[0]}-{scoreFt[1]}
            {hasPen && (
              <small>
                {scorePen[0]}-{scorePen[1]}
              </small>
            )}
          </div>
        </div>
      </ftb-link>
    );
  }

  private renderDuelStats(side: GameSide) {
    const s = this.game.previousDuels.reduce(
      (stats, g) => {
        const teamSide = side.team._id === g.home.team._id ? g.home : g.away;
        const oppSide = side.team._id === g.away.team._id ? g.home : g.away;
        stats.scored += teamSide.score.ft;
        stats.conceded += oppSide.score.ft;
        if (teamSide.isWinner) {
          stats.w++;
        } else if (teamSide.isLoser) {
          stats.l++;
        } else {
          stats.d++;
        }
        return stats;
      },
      { w: 0, d: 0, l: 0, scored: 0, conceded: 0 },
    );

    return (
      <div class="side">
        <div class="item">
          <div class="title">{translations.standings.wdl[userState.language]}:</div>
          <div class="value">
            {s.w}-{s.d}-{s.l}
          </div>
        </div>
        <div class="item">
          <div class="title">{translations.standings.gd[userState.language]}:</div>
          <div class="value">
            {s.scored}-{s.conceded}
          </div>
        </div>
      </div>
    );
  }

  private renderHistory() {
    return (
      <ftb-pagination
        class="history"
        totalItems={this.game.previousDuels.length}
        items={this.game.previousDuels}
        renderItem={(g: Game) => (
          <ftb-game-card
            game={g}
            topFields={[FtbGameCardField.champSeason, FtbGameCardField.round]}
            leftFields={[FtbGameCardField.date, FtbGameCardField.time, FtbGameCardField.stadium]}
          ></ftb-game-card>
        )}
        rows={2}
        itemMinWidthPx={190}
        itemHeightPx={112}
      ></ftb-pagination>
    );
  }
}
