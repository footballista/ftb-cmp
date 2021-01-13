import { Component, h, Host, Prop, State } from '@stencil/core';
import { Game, GameState, Stage, translations } from 'ftb-models';
import last from 'lodash-es/last';
import range from 'lodash-es/range';
import rangeRight from 'lodash-es/rangeRight';
import sortBy from 'lodash-es/sortBy';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-stage-cup-net',
  styleUrl: 'ftb-stage-cup-net.component.scss',
  shadow: false,
})
export class FtbStageCupNet {
  @Prop() stage!: Stage;
  @State() shortForm = false;

  render() {
    return (
      <Host>
        <div class="ftb-stage-cup-net__wrapper">
          <div class="ftb-stage-cup-net__background">
            {!this.stage.cupNet.length ? (
              <div class="ftb-stage-cup-net__no-games">{translations.champ.stage_has_no_games[userState.language]}</div>
            ) : (
              this.renderNet()
            )}
          </div>
        </div>
      </Host>
    );
  }

  private renderNet() {
    const games = {};
    for (const g of this.stage.cupNet) {
      games[g.tourNumber] ??= {};
      games[g.tourNumber][g.netPosition] ??= [];
      const slot = games[g.tourNumber][g.netPosition];
      g.stage = new Stage({ format: this.stage.format });
      if (slot.length) {
        if (slot[0].home.team._id !== g.home.team._id && slot[0].home.team._id !== g.away.team._id) {
          throw new Error(
            `not possible to assign different teams to one slot: tourNumber: ${g.tourNumber} netPosition: ${g.netPosition}`,
          );
        }
        const switchScore = slot[0].home.team._id != g.home.team._id;
        slot.push(Object.assign(g, { home: switchScore ? g.away : g.home, away: switchScore ? g.home : g.away }));
      } else {
        slot.push(g);
      }
    }

    const rounds = sortBy(Object.keys(games), t => (t === '11' ? 0.5 : t))
      .reverse()
      .map(r => parseInt(r));

    // fill empty rounds with null-games
    const lastRound = last(rounds);
    rangeRight(lastRound).forEach(r => rounds.push(r));
    rangeRight(lastRound).forEach(r => (games[r] = range(Math.pow(2, r)).reduce(res => [...res, null], [])));

    return (
      <div class="ftb-stage-cup-net__net">
        {rounds.map(r => {
          return (
            <div class="ftb-stage-cup-net__column">
              <div class="ftb-stage-cup-net__head">
                <ftb-game-tour game={games[r][0][0]}></ftb-game-tour>
              </div>
              <div class="ftb-stage-cup-net__body">
                {sortBy(Object.keys(games[r]), [n => n]).map(pos => (
                  <div class="game">
                    {[this.renderRow(games[r][pos], 'home'), this.renderRow(games[r][pos], 'away')]}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  private renderRow(games: Game[], side: 'home' | 'away') {
    let isWinner = false;
    let isLoser = false;
    // don't define winner/loser if pair has not finished game(s)
    if (!games.some(g => g.state !== GameState.CLOSED)) {
      const penGame = games.find(g => Boolean(g.home.score.pen) || Boolean(g.away.score.pen));
      // if we have game with penalties, watch them only
      if (penGame) {
        if (penGame.home.score.pen > penGame.away.score.pen) {
          isWinner = side === 'home' ? true : false;
        } else {
          isWinner = side === 'home' ? false : true;
        }
        isLoser = !isWinner;
      } else {
        // we should parse initial games array where sides are not switched.
        const gm = games[0];
        const initialGames = this.stage.cupNet.filter(
          g =>
            (g.home.team._id === gm.home.team._id || g.home.team._id === gm.away.team._id) &&
            (g.away.team._id === gm.home.team._id || g.away.team._id === gm.away.team._id) &&
            g.tourNumber == gm.tourNumber,
        );
        const totalHome = initialGames.reduce((score, game) => {
          const awayKoef = game.home.team._id === games[0].home.team._id ? 1 : 2;
          return score + game.home.score.ft * awayKoef;
        }, 0);
        const totalAway = initialGames.reduce((score, game) => {
          const awayKoef = game.away.team._id === games[0].home.team._id ? 1 : 2;
          return score + game.away.score.ft * awayKoef;
        }, 0);
        if (totalHome > totalAway) {
          isWinner = side === 'home' ? true : false;
          isLoser = !isWinner;
        } else if (totalHome < totalAway) {
          isWinner = side === 'home' ? false : true;
          isLoser = !isWinner;
        } else {
          isWinner = isLoser = false;
        }
      }
    }

    return (
      <ftb-link route="team" params={{ teamId: games[0][side].team._id, teamName: games[0][side].team.name }}>
        <div
          class={{
            row: true,
            short: this.shortForm,
            winner: isWinner,
            loser: isLoser,
          }}
        >
          <div class="name">
            <ftb-team-logo team={games[0][side].team}></ftb-team-logo>
            {this.shortForm ? games[0][side].team.shortName : games[0][side].team.name}
          </div>
          {games.map(g => (
            <div class="score">
              <ftb-game-side-score game={g} side={g[side]}></ftb-game-side-score>
            </div>
          ))}
        </div>
      </ftb-link>
    );
  }
}
