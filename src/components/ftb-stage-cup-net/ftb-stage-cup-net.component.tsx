import { Component, h, Prop, Watch } from '@stencil/core';
import {
  createEntityRoute,
  Game,
  GameSide,
  GameState,
  routingState,
  Stage,
  Team,
  translations,
  userState,
} from 'ftb-models';

import last from 'lodash-es/last';
import range from 'lodash-es/range';
import rangeRight from 'lodash-es/rangeRight';
import sortBy from 'lodash-es/sortBy';

@Component({
  tag: 'ftb-stage-cup-net',
  styleUrl: 'ftb-stage-cup-net.component.scss',
  shadow: false,
})
export class FtbStageCupNet {
  @Prop() stage!: Stage;
  @Prop()
  highlightTeam?: Team; //team to highlight on the net with color

  @Watch('highlightTeam') onHlTeamChange(newValue: Team, oldValue: Team) {
    console.log('hl', newValue, oldValue);
  }

  gameElements: { [columnIdx: number]: { [netPosition: number]: { el: HTMLElement; game: Game } } } = {};
  netContainer: HTMLElement;

  componentDidRender() {
    this.drawNet();
    this.setHighlightTeam(this.highlightTeam);
  }

  addGameElement(idx: number, netPosition: number, game: Game, el: HTMLElement) {
    this.gameElements[idx] ??= {};
    this.gameElements[idx][netPosition] = { el, game };
  }

  render() {
    if (!this.stage.cupNet.length) {
      return <div class="ftb-stage-cup-net__no-games">{translations.champ.stage_has_no_games[userState.language]}</div>;
    }

    const { games, rounds } = this.arrangeGamesAndRounds();

    return (
      <div class={'ftb-stage-cup-net__body '}>
        {rounds.map((r, idx) => (
          <div class="ftb-stage-cup-net__column">
            {sortBy(Object.keys(games[r]), [n => n]).map(netPosition => (
              <div
                class="ftb-stage-cup-net__game"
                ref={el =>
                  this.addGameElement(idx, netPosition, games[r][netPosition] ? games[r][netPosition][0] : null, el)
                }
              >
                {this.renderSlot(games[r][netPosition])}
              </div>
            ))}
          </div>
        ))}
        <div class="ftb-stage-cup-net__net-container" ref={el => (this.netContainer = el)} />
      </div>
    );
  }

  renderSlot(games: Game[]) {
    const getScoresForSide = side =>
      games.map(g => ({ game: g, score: g.home.team._id == side.team._id ? g.home.score : g.away.score }));

    const renderRow = (side?: GameSide) => {
      if (!side) {
        return <div class="ftb-stage-cup-net__row ftb-stage-cup-net__row-empty" />;
      }
      return (
        <div
          class={'ftb-stage-cup-net__row' + (games[0]?.tourNumber !== 2 ? ' compact' : '')}
          onMouseOver={() => this.setHighlightTeam(side.team)}
          onMouseOut={() => this.setHighlightTeam(this.highlightTeam)}
        >
          <ftb-team-logo team={side.team} />
          <ion-router-link href={routingState.routes.team && createEntityRoute(side.team)}>
            <div class={'ftb-stage-cup-net__team-name'}>{side.team.name}</div>
          </ion-router-link>
          <div class="ftb-stage-cup-net__score-block">
            {getScoresForSide(side).map(gs => (
              <div class="ftb-stage-cup-net__score">
                {gs.game.state == GameState.CLOSED ? (
                  [
                    <div class="ftb-stage-cup-net__ft-score">{gs.score.ft}</div>,
                    (gs.game.home.score.pen || gs.game.away.score.pen) && (
                      <div class="ftb-stage-cup-net__pen-score">{gs.score.pen}</div>
                    ),
                    gs.game.techDefeat && gs.score.ft > 0 && (
                      <div class="ftb-stage-cup-net__td-mark">{translations.game.td[userState.language]}</div>
                    ),
                  ]
                ) : (
                  <div class="ftb-stage-cup-net__no-score">-</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    return [renderRow(games ? games[0].home : null), renderRow(games ? games[0].away : null)];
  }

  drawNet() {
    let net = '';

    const onDrawComplete = () => (this.netContainer.innerHTML = net);

    for (let i of Object.keys(this.gameElements).map(i => Number(i))) {
      if (!this.gameElements[i + 1]) return onDrawComplete();

      for (const netPos of Object.keys(this.gameElements[i]).map(i => Number(i))) {
        const { el } = this.gameElements[i][netPos];
        const top = el.offsetTop + el.offsetHeight / 2;
        const left = el.offsetLeft + el.offsetWidth;
        const { el: nextEl } = this.gameElements[i + 1][Math.floor(netPos / 2)];

        net += `<div class="end dot" style="top: ${top}px; left: ${left}px"></div>`;

        const topNext = nextEl.offsetTop + nextEl.offsetHeight / 2;
        const leftNext = nextEl.offsetLeft;

        net += `<div class="dot start" style="top: ${topNext}px; left: ${leftNext}px"></div>`;
        net += `<svg class="ftb-stage-cup-net__svg-line">`;
        net += this.connectSvgDots([left, top], [leftNext, topNext]);
        net += '</svg>';
      }
    }
  }

  connectSvgDots([x0, y0], [x1, y1]) {
    let line = `M ${x0}, ${y0}`;
    if (y0 == y1) {
      line += 'H' + x1;
    } else {
      if (x1 > x0) {
        line += 'H' + (x1 - 40);
        line += `Q ${x1 - 30},${y0} ${x1 - 30} ${y0 + (y1 > y0 ? 10 : -10)}`;
        line += 'V' + y1;
        line += 'H' + x1;
      } else {
        line += 'H' + (x1 + 40);
        line += `Q ${x1 + 30},${y0} ${x1 + 30} ${y0 + (y1 > y0 ? 10 : -10)}`;
        line += 'V' + y1;
        line += 'H' + x1;
      }
    }

    return '<path d="' + line + '"/></svg>';
  }

  arrangeGamesAndRounds() {
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

    return { games, rounds };
  }

  setHighlightTeam(team: Team | null) {
    const endDots = Array.from(this.netContainer.querySelectorAll('.dot.end'));
    const startDots = Array.from(this.netContainer.querySelectorAll('.dot.start'));
    const lines = Array.from(this.netContainer.querySelectorAll('.ftb-stage-cup-net__svg-line'));

    let dotsCounter = -1;
    for (let i of Object.keys(this.gameElements).map(i => Number(i))) {
      for (const netPos of Object.keys(this.gameElements[i]).map(i => Number(i))) {
        dotsCounter++;
        const ge = this.gameElements[i][netPos];
        const rows = Array.from(ge.el.querySelectorAll('.ftb-stage-cup-net__row'));
        for (const row of rows) {
          row.classList.remove('highlighted');
        }
        if (team && ge.game?.home.team._id == team._id) {
          rows[0].classList.add('highlighted');
        }
        if (team && ge.game?.away.team._id == team._id) {
          rows[1].classList.add('highlighted');
        }

        const { game } = this.gameElements[i][netPos];
        const { game: gameNext } = this.gameElements[i + 1]
          ? this.gameElements[i + 1][Math.floor(netPos / 2)]
          : { game: null };

        const isHighlighted =
          game &&
          gameNext &&
          (game.home.team._id == team?._id || game.away.team._id == team?._id) &&
          (gameNext.home.team._id == team?._id || gameNext.away.team._id == team?._id);

        if (isHighlighted) {
          endDots[dotsCounter]?.classList.add('highlighted');
          startDots[dotsCounter]?.classList.add('highlighted');
          lines[dotsCounter]?.classList.add('highlighted');
        } else {
          endDots[dotsCounter]?.classList.remove('highlighted');
          startDots[dotsCounter]?.classList.remove('highlighted');
          lines[dotsCounter]?.classList.remove('highlighted');
        }
      }
    }
  }
}
