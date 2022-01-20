import { Component, Element, Prop, Host, h, writeTask, Build } from '@stencil/core';
import {
  createEntityRoute,
  CupRounds,
  Game,
  GameState,
  routingState,
  Stage,
  StageFormat,
  Team,
  translations,
  userState,
} from 'ftb-models';
import orderBy from 'lodash-es/orderBy';
import last from 'lodash-es/last';
import max from 'lodash-es/max';
import rangeRight from 'lodash-es/rangeRight';
import range from 'lodash-es/range';
import { href } from 'stencil-router-v2';

/** if at least one round has more games than this value
 * split net to two sides */
const SPLIT_SIDES_GAMES_THRESHOLD = 4;

/** game for 3rd place is rendered in a special slot, it's a helper constant for this purpose */
const NET_POS_3RD = -1;

interface SlotInterface {
  leftDotEl: HTMLElement;
  rightDotEl: HTMLElement;
  netPosition: number;
  tourNumber: number;
  games: Array<Game>;
}

@Component({
  tag: 'ftb-cup-net-quadratic',
  styleUrl: 'ftb-cup-net-quadratic.component.scss',
  shadow: false,
})
export class FtbStageCupNetQuadratic {
  @Prop() stage!: Stage;
  /** team to highlight on the net with color */
  @Prop() highlightTeam?: Team;
  @Prop() splitSidesThreshold?: number;

  @Element() el;

  columns: Array<{
    tourNumber: number;
    hasNewTeams: boolean;
    isReverse?: boolean;
    slots: SlotInterface[];
  }> = [];

  netLines: Array<{
    from: SlotInterface;
    to: SlotInterface;
    el: SVGElement;
  }> = [];

  resizeObserver;
  netContainer: HTMLElement;

  async componentWillLoad() {
    if (!this.stage) return;

    if (!this.stage.cupNet) {
      throw new Error('Stage does not have cup net');
    }
    this.defineColumns();
  }

  connectedCallback() {
    if (!this.stage) return;
    if (Build.isBrowser) {
      this.resizeObserver = new ResizeObserver(() => this.drawNet());
      this.resizeObserver.observe(this.el);
    }
  }

  componentDidLoad() {
    console.log(this.splitSidesThreshold);
    if (!this.stage) return;
    this.drawNet();
    this.highlight(this.highlightTeam);
  }

  componentDidRender() {
    if (!this.stage) return;
    this.highlight(this.highlightTeam);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  defineColumns() {
    const slotsMap = this.stage.cupNet.reduce((map, g) => {
      const tourNumber = g.tourNumber != CupRounds['3rd_place'] ? g.tourNumber : CupRounds.final; // display 3-rd place game below final, so it will have same round number
      const netPosition = g.tourNumber != CupRounds['3rd_place'] ? g.netPosition : NET_POS_3RD; // setting custom net position, so it will not be confused with regular net games
      map[tourNumber] ??= {};
      map[tourNumber][netPosition] ??= {
        leftDotEl: null,
        rightDotEl: null,
        netPosition,
        tourNumber: g.tourNumber, // using original tour Number, not changed one,
        games: [],
      };
      if (
        map[tourNumber][netPosition].games.some(
          gm =>
            ![gm.home.team._id, gm.away.team._id].includes(g.home.team._id) ||
            ![gm.home.team._id, gm.away.team._id].includes(g.away.team._id),
        )
      ) {
        throw new Error(
          `Failed to assign ${g.home.team.name} - ${g.away.team.name} to slot ${netPosition}: already has different teams`,
        );
      }

      // if we have several games in one block, we need to sort sides so one team will always be hosts and other - guests
      const getGameWithSortedSides = (game: Game, exampleGame?: Game) => {
        if (!exampleGame) {
          // defining home-away based on how they are located on the net in previous rounds
          const gameWithTeam = orderBy(this.stage.cupNet, ['tourNumber', 'netPosition'], ['desc', 'asc']).find(
            g =>
              [g.home.team._id, g.away.team._id].includes(game.home.team._id) ||
              [g.home.team._id, g.away.team._id].includes(game.away.team._id),
          );
          if ([gameWithTeam.home.team._id, gameWithTeam.away.team._id].includes(game.home.team._id)) {
            return game;
          } else {
            return Object.assign(game, { home: game.away, away: game.home });
          }
        } else {
          // adding more games to existing pair in right order
          if (game.home.team._id === exampleGame.home.team._id) return game;
          return Object.assign(game, { home: game.away, away: game.home });
        }
      };

      map[tourNumber][netPosition].games.push(getGameWithSortedSides(g, map[tourNumber][netPosition].games[0]));

      return map;
    }, {});

    const splitSides =
      Boolean(slotsMap[CupRounds.final] && slotsMap[CupRounds.final][NET_POS_3RD]) ||
      Object.values(slotsMap).some(
        r => Object.keys(r).length > (this.splitSidesThreshold || SPLIT_SIDES_GAMES_THRESHOLD),
      );

    const columnsLeft = [];
    const columnsRight = [];
    const addedTeamsIds = new Set(); // if round has unique teams, display their names
    for (const tourNumber of orderBy(Object.keys(slotsMap), [r => r], ['desc'])) {
      let hasNewTeams = false;
      Object.values(slotsMap[tourNumber]).forEach((slot: { games: Game[] }) => {
        [slot.games[0].home.team, slot.games[0].away.team].forEach(team => {
          if (!addedTeamsIds.has(team._id)) {
            hasNewTeams = true;
            addedTeamsIds.add(team._id);
          }
        });
      });

      const slots = orderBy(Object.values(slotsMap[tourNumber]), ['netPosition'], ['asc']);

      const column = { tourNumber, hasNewTeams, slots };

      if (!splitSides) {
        columnsLeft.push(column);
      } else {
        columnsLeft.push({
          ...column,
          ...{
            slots: slots.filter(s => s.netPosition < Math.pow(2, tourNumber) / 2),
          },
        });
        if (tourNumber != CupRounds.final && tourNumber != CupRounds['3rd_place']) {
          // final round belongs to left side only (as well as 3rd place)
          columnsRight.unshift({
            ...column,
            ...{
              isReverse: true,
              slots: slots.filter(s => s.netPosition >= Math.pow(2, tourNumber) / 2),
            },
          });
        }
      }
    }

    const lastRound = last(columnsLeft).tourNumber;
    if (lastRound > 0) {
      // filling net with rounds with empty games
      const maxSlotsInOneRound = max([...columnsLeft, ...columnsRight].map(r => r.slots.length));

      rangeRight(lastRound).forEach((r: number) => {
        if (!splitSides) {
          const slotsNumber = Math.min(maxSlotsInOneRound, Math.pow(2, r));

          const slots = range(slotsNumber).reduce(
            (res, i) => [...res, { netPosition: i, tourNumber: r, games: [] }],
            [],
          );
          columnsLeft.push({ roundNumber: r, showTeamNames: false, slots });
        } else {
          const slotsNumber = Math.min(maxSlotsInOneRound, Math.pow(2, r) / 2);
          const slots = range(slotsNumber).reduce(
            (res, i) => [...res, { netPosition: i, tourNumber: r, games: [] }],
            [],
          );
          columnsLeft.push({ roundNumber: r, showTeamNames: false, slots });
          if (r != 0) {
            const rightSlots = range(slotsNumber).reduce(
              (res, i) => [...res, { netPosition: i + slotsNumber, tourNumber: r, games: [] }],
              [],
            );
            columnsRight.unshift({ roundNumber: r, showTeamNames: false, slots: rightSlots });
          }
        }
      });
    }

    this.columns = [...columnsLeft, ...columnsRight];
  }

  highlight(team: Team | null) {
    writeTask(() => {
      const gameHasTeam = (g: Game | null) => {
        if (!g) return;
        return g.home.team._id == team?._id || g.away.team._id == team?._id;
      };

      /** clear all highlighting first */
      this.netLines.forEach(line => {
        line.el.classList.remove('highlighted');
        line.from.leftDotEl.classList.remove('highlighted');
        line.from.rightDotEl.classList.remove('highlighted');

        Array.from(line.from.leftDotEl.parentElement.querySelectorAll('.row')).forEach(r =>
          r.classList.remove('highlighted'),
        );
        Array.from(line.to.leftDotEl.parentElement.querySelectorAll('.row')).forEach(r =>
          r.classList.remove('highlighted'),
        );
        line.to.leftDotEl.classList.remove('highlighted');
        line.to.rightDotEl.classList.remove('highlighted');
      });

      if (team) {
        this.netLines?.forEach(line => {
          if (gameHasTeam(line.from.games[0]) && gameHasTeam(line.to.games[0])) {
            line.el.classList.add('highlighted');
            line.from.rightDotEl.classList.add('highlighted');
            line.to.leftDotEl.classList.add('highlighted');
          }

          if (line.from.games) {
            if (line.from.games[0].home.team._id == team._id) {
              line.from.rightDotEl.parentElement.querySelectorAll('.row')[0].classList.add('highlighted');
            } else if (line.from.games[0].away.team._id == team._id) {
              line.from.rightDotEl.parentElement.querySelectorAll('.row')[1].classList.add('highlighted');
            }
          }

          if (line.to.games) {
            if (line.to.games[0].home.team._id == team._id) {
              line.to.rightDotEl.parentElement.querySelectorAll('.row')[0].classList.add('highlighted');
            } else if (line.to.games[0].away.team._id == team._id) {
              line.to.rightDotEl.parentElement.querySelectorAll('.row')[1].classList.add('highlighted');
            }
          }
        });
      }
    });
  }

  render() {
    if (!this.stage) return;

    return (
      <Host>
        <div class="net-body">
          <div class="columns">
            {this.columns.map(column => (
              <div class={'column' + (!column.hasNewTeams ? ' short' : '')}>
                {column.slots.map(s => this.renderSlot(s))}
              </div>
            ))}
          </div>

          <div class="net-container" ref={el => (this.netContainer = el)} />
        </div>
      </Host>
    );
  }

  renderSlot(s: SlotInterface) {
    const renderRow = (side: 'home' | 'away' | null) => {
      if (!side) {
        return <div class="row empty" />;
      }

      return (
        <div
          class={'row'}
          onMouseOver={() => this.highlight(s.games[0][side].team)}
          onMouseOut={() => this.highlight(this.highlightTeam)}
        >
          <ftb-team-logo team={s.games[0][side].team} />
          <a {...href(routingState.routes.team && createEntityRoute(s.games[0][side].team))}>
            <div class={'team-name'}>{s.games[0][side].team.name}</div>
          </a>
          <div class="score-block">
            {s.games.map(game => (
              <div class="score">
                {game.state == GameState.CLOSED ? (
                  [
                    <div class="ft-score">{game[side].score.ft}</div>,
                    (game.home.score.pen || game.away.score.pen) && <div class="pen-score">{game[side].score.pen}</div>,
                    game.techDefeat && game[side].score.ft > 0 && (
                      <div class="td-mark">{translations.game.td[userState.language]}</div>
                    ),
                  ]
                ) : (
                  <div class="no-score">-</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div class="slot">
        <ftb-game-tour game={new Game({ tourNumber: s.tourNumber, stage: { format: StageFormat.cup } })} />
        <div class="game">
          <div class="dot left" ref={el => (s.leftDotEl = el)} />
          <div class="dot right" ref={el => (s.rightDotEl = el)} />
          {renderRow(s.games?.length ? 'home' : null)}
          {renderRow(s.games?.length ? 'away' : null)}
        </div>
      </div>
    );
  }

  drawNet() {
    writeTask(() => {
      const netLines: Array<{ from: SlotInterface; to: SlotInterface; el: SVGElement }> = [];

      this.columns.forEach(c => {
        c.slots.forEach(s => {
          const gameEl = s.leftDotEl.parentElement;
          s.leftDotEl.style.top = s.rightDotEl.style.top = gameEl.offsetTop + gameEl.offsetHeight / 2 + 'px';
          s.rightDotEl.style.left = gameEl.offsetLeft + gameEl.offsetWidth + 'px';
          s.leftDotEl.style.left = gameEl.offsetLeft + 'px';
        });
      });

      for (let i = 0; i < this.columns.filter(s => !s.isReverse).length - 1; i++) {
        this.columns[i].slots.forEach(s => {
          const nextSlot = this.columns[i + 1].slots.find(sl => sl.netPosition == Math.floor(s.netPosition / 2));

          if (nextSlot) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.classList.add('svg-line');
            svg.appendChild(this.connectDots(s.rightDotEl, nextSlot.leftDotEl));
            netLines.push({
              from: s,
              to: nextSlot,
              el: svg,
            });
            s.rightDotEl.classList.add('connected');
            nextSlot.leftDotEl.classList.add('connected');
          }
        });
      }

      for (let i = this.columns.length - 1; i > this.columns.filter(s => !s.isReverse).length - 1; i--) {
        this.columns[i].slots.forEach(s => {
          const nextSlot = this.columns[i - 1].slots.find(sl => sl.netPosition == Math.floor(s.netPosition / 2));
          if (nextSlot) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.classList.add('svg-line');
            svg.appendChild(this.connectDots(nextSlot.rightDotEl, s.leftDotEl));
            netLines.push({
              from: nextSlot,
              to: s,
              el: svg,
            });
            s.leftDotEl.classList.add('connected');
            nextSlot.rightDotEl.classList.add('connected');
          }
        });
      }

      this.netLines = netLines;
      this.netContainer.innerHTML = '';
      this.netContainer.append(...netLines.map(l => l.el));
    });
  }

  connectDots(leftDot: HTMLElement, rightDot: HTMLElement) {
    const x0 = leftDot.offsetLeft;
    const y0 = leftDot.offsetTop;
    const x1 = rightDot.offsetLeft;
    const y1 = rightDot.offsetTop;

    let line = `M ${x0}, ${y0}`;
    if (y0 == y1) {
      line += ' H' + x1;
    } else {
      const xM = x0 + (x1 - x0) / 2;

      const firstCurve = {
        x0: xM - 10,
        x1: xM,
        y0: y0,
        y1: y0 + (y1 > y0 ? 10 : -10),
      };

      line += ' H ' + firstCurve.x0;
      line += ' Q ' + firstCurve.x1 + ',' + firstCurve.y0 + ', ' + firstCurve.x1 + ',' + firstCurve.y1;

      const secondCurve = {
        x0: xM,
        x1: xM + 10,
        y0: y1 - (y1 > y0 ? 10 : -10),
        y1: y1,
      };
      line += ' V ' + secondCurve.y0;
      line += ' Q ' + secondCurve.x0 + ',' + secondCurve.y1 + ', ' + secondCurve.x1 + ',' + secondCurve.y1;
      line += ' H ' + x1;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', line);

    return path;
  }
}
