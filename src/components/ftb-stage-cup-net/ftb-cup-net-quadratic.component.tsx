import { Component, Element, Prop, Host, h } from '@stencil/core';
import {
  createEntityRoute,
  CupRounds,
  Game,
  GameSide,
  GameState,
  Stage,
  StageFormat,
  Team,
  translations,
  userState,
} from 'ftb-models';
import orderBy from 'lodash-es/orderBy';

/** if at least one round has more games than this value
 * split net to two sides */
const SPLIT_SIDES_GAMES_THRESHOLD = 4;

/** game for 3rd place is rendered in a special slot, it's a helper constant for this purpose */
const NET_POS_3RD = -1;

interface SlotInterface {
  el: HTMLElement;
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

  @Element() el;

  columns: Array<{
    tourNumber: number;
    hasNewTeams: boolean;
    isReverse?: boolean;
    slots: SlotInterface[];
  }> = [];

  resizeObserver: ResizeObserver;

  componentWillLoad() {
    if (!this.stage.cupNet) {
      throw new Error('Stage does not have cup net');
    }

    this.resizeObserver = new ResizeObserver(() => this.drawNet());
    this.resizeObserver.observe(this.el);

    this.defineColumns();
  }

  componentDidRender() {
    this.drawNet();
    this.highlight(this.highlightTeam);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  defineColumns() {
    const slotsMap = this.stage.cupNet.reduce((map, g) => {
      const tourNumber = g.tourNumber != CupRounds['3rd_place'] ? g.tourNumber : CupRounds.final; // display 3-rd place game below final, so it will have same round number
      const netPosition = g.tourNumber != CupRounds['3rd_place'] ? g.netPosition : NET_POS_3RD; // setting custom net position so it will not be confused with regular net games
      map[tourNumber] ??= {};
      map[tourNumber][netPosition] ??= {
        el: null, // this will be a link to HTMLElement when rendered
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
      function getGameWithSortedSides(game: Game, exampleGame?: Game) {
        if (!exampleGame) return game;
        if (game.home.team._id === exampleGame.home.team._id) return game;
        return Object.assign(game, { home: game.away, away: game.home });
      }

      map[tourNumber][netPosition].games.push(getGameWithSortedSides(g, map[tourNumber][netPosition][0]));

      return map;
    }, {});

    const splitSides =
      Boolean(slotsMap[CupRounds.final] && slotsMap[CupRounds.final][NET_POS_3RD]) ||
      Object.values(slotsMap).some(r => Object.keys(r).length > SPLIT_SIDES_GAMES_THRESHOLD);

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

    console.log(columnsLeft);
    this.columns = [...columnsLeft, ...columnsRight];
  }

  drawNet() {}

  highlight(team: Team | null) {
    team;
  }

  render() {
    return (
      <Host>
        <div class="net-body">
          {this.columns.map(column => (
            <div class={'column' + (!column.hasNewTeams ? ' short' : '')}>
              {column.slots.map(s => this.renderSlot(s))}
            </div>
          ))}
        </div>
      </Host>
    );
  }

  renderSlot(s: SlotInterface) {
    const renderRow = (side?: GameSide) => {
      if (!side) {
        return <div class="row empty" />;
      }
      return (
        <div
          class={'row' + (s.games[0]?.tourNumber !== 2 ? ' compact' : '')}
          onMouseOver={() => this.highlight(side.team)}
          onMouseOut={() => this.highlight(this.highlightTeam)}
        >
          <ftb-team-logo team={side.team} />
          <ion-router-link href={createEntityRoute(side.team)}>
            <div class={'team-name'}>{side.team.name}</div>
          </ion-router-link>
          <div class="score-block">
            {s.games.map(game => (
              <div class="score">
                {game.state == GameState.CLOSED ? (
                  [
                    <div class="ft-score">{side.score.ft}</div>,
                    (game.home.score.pen || game.away.score.pen) && <div class="pen-score">{side.score.pen}</div>,
                    game.techDefeat && side.score.ft > 0 && (
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

    return [
      <ftb-game-tour game={new Game({ tourNumber: s.tourNumber, stage: { format: StageFormat.cup } })} />,
      <div class="game">
        {renderRow(s.games ? s.games[0].home : null)}
        {renderRow(s.games ? s.games[0].away : null)}
      </div>,
    ];
  }
}
