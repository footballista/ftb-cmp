import { Component, h, Host, State } from '@stencil/core';
import { CupRounds, Game, GameState, Stage, StageFormat, Team, teamMocks } from 'ftb-models';

@Component({
  tag: 'ftb-cup-net-explorer-stories',
  styleUrl: 'ftb-cup-net-explorer.stories.scss',
  shadow: false,
})
export class FtbStageCupNetStories {
  @State() hlT = new Team(teamMocks.Barcelona);

  render() {
    return (
      <Host>
        <h1>Cup net explorer</h1>
        <p>
          Big nets with many games aren't best fit for site layouts. It's better to wrap them in a component where they
          can be dragged and zoomed.
          <pre class="inline-code">
            <code> Ftb-cup-net-explorer</code>
          </pre>{' '}
          serves this purpose.
          <ftb-code-snippet
            code="<ftb-cup-net-explorer>
  <ftb-cup-net stage={stage}/>
</ftb-cup-net-explorer>"
          />
        </p>
        <ftb-cup-net-explorer
          stage={createStage(
            'final',
            '1/2',
            '1/2',
            '1/4',
            '1/4',
            '1/4',
            '1/4',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
          )}
          splitSidesThreshold={16}
        />

        <h2>Team highlighting</h2>
        <p>If stage has highlighted team, component will search for highlighted nodes and shift nearest to viewport</p>

        <ftb-cup-net-explorer
          stage={createStage(
            'final',
            '1/2',
            '1/2',
            '1/4',
            '1/4',
            '1/4',
            '1/4',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
            '1/8',
          )}
          splitSidesThreshold={16}
          highlightTeam={this.hlT}
        />
        <button
          class="switch-team-button"
          onClick={() => (this.hlT = new Team(this.hlT.name == 'Chelsea' ? teamMocks.Barcelona : teamMocks.Chelsea))}
        >
          Change team to {this.hlT.name == 'Chelsea' ? 'Barcelona' : 'Chelsea'}
        </button>
        <ftb-code-snippet
          code="<ftb-cup-net-explorer>
  <ftb-cup-net stage={stage} hightlightTeam={team}/>
</ftb-cup-net-explorer>"
        />
      </Host>
    );
  }
}

const createStage = (...gameCodes: Array<'final' | '3rd_place' | '1/2' | '1/4' | '1/8'>) => {
  const stage = new Stage({ _id: 7510, format: StageFormat.cup, name: 'Плей-офф' });
  const generator = new GamesGanerator();
  stage.cupNet = gameCodes.reduce((games, code) => [...games, ...generator.getGames(code)], []);
  return stage;
};

class GamesGanerator {
  private games = {
    'final': (function* () {
      yield [
        {
          _id: 1,
          netPosition: 0,
          tourNumber: CupRounds.final,
          stateCode: GameState.NOT_STARTED,
          teamHome: teamMocks.Arsenal,
          teamAway: teamMocks.Chelsea,
        },
      ];
    })(),
    '3rd_place': (function* () {
      yield [
        {
          _id: 2,
          netPosition: 1,
          tourNumber: CupRounds['3rd_place'],
          stateCode: GameState.NOT_STARTED,
          teamHome: teamMocks.Barcelona,
          teamAway: teamMocks.Borussia,
        },
      ];
    })(),
    '1/2': (function* () {
      yield [
        {
          _id: 3,
          netPosition: 0,
          tourNumber: CupRounds['1/2'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Barcelona,
          teamAway: teamMocks.Arsenal,
          scoreFtHome: 3,
          scoreFtAway: 5,
        },
        {
          _id: 4,
          netPosition: 0,
          tourNumber: CupRounds['1/2'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Barcelona,
          teamAway: teamMocks.Arsenal,
          scoreFtHome: 1,
          scoreFtAway: 2,
        },
      ];
      yield [
        {
          _id: 4,
          netPosition: 1,
          tourNumber: CupRounds['1/2'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Borussia,
          teamAway: teamMocks.Chelsea,
          scoreFtHome: 2,
          scoreFtAway: 2,
        },
        {
          _id: 5,
          netPosition: 1,
          tourNumber: CupRounds['1/2'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Chelsea,
          teamAway: teamMocks.Borussia,
          scoreFtHome: 0,
          scoreFtAway: 0,
          scorePenHome: 5,
          scorePenAway: 3,
        },
      ];
    })(),
    '1/4': (function* () {
      yield [
        {
          _id: 7,
          netPosition: 0,
          tourNumber: CupRounds['1/4'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.ManCity,
          teamAway: teamMocks.Arsenal,
          scoreFtHome: 1,
          scoreFtAway: 3,
        },
      ];
      yield [
        {
          _id: 8,
          netPosition: 1,
          tourNumber: CupRounds['1/4'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Barcelona,
          teamAway: teamMocks.Fiorentina,
          scoreFtHome: 5,
          scoreFtAway: 0,
          techDefeat: true,
        },
      ];
      yield [
        {
          _id: 9,
          netPosition: 2,
          tourNumber: CupRounds['1/4'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Chelsea,
          teamAway: teamMocks.ManU,
          scoreFtHome: 2,
          scoreFtAway: 0,
        },
      ];
      yield [
        {
          _id: 9,
          netPosition: 3,
          tourNumber: CupRounds['1/4'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Bayern,
          teamAway: teamMocks.Borussia,
          scoreFtHome: 4,
          scoreFtAway: 6,
        },
      ];
    })(),
    '1/8': (function* () {
      yield [
        {
          _id: 10,
          netPosition: 0,
          tourNumber: CupRounds['1/8'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.ManCity,
          teamAway: teamMocks.Lecce,
          scoreFtHome: 2,
          scoreFtAway: 0,
        },
      ];
      yield [
        {
          _id: 11,
          netPosition: 1,
          tourNumber: CupRounds['1/8'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Arsenal,
          teamAway: teamMocks.Inter,
          scoreFtHome: 4,
          scoreFtAway: 1,
        },
      ];
      yield [
        {
          _id: 12,
          netPosition: 2,
          tourNumber: CupRounds['1/8'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Barcelona,
          teamAway: teamMocks.Atalanta,
          scoreFtHome: 5,
          scoreFtAway: 4,
        },
      ];
      yield [
        {
          _id: 13,
          netPosition: 3,
          tourNumber: CupRounds['1/8'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Fiorentina,
          teamAway: teamMocks.Betis,
          scoreFtHome: 8,
          scoreFtAway: 6,
        },
      ];
      yield [
        {
          _id: 14,
          netPosition: 4,
          tourNumber: CupRounds['1/8'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Chelsea,
          teamAway: teamMocks.Juventus,
          scoreFtHome: 4,
          scoreFtAway: 3,
        },
      ];
      yield [
        {
          _id: 15,
          netPosition: 5,
          tourNumber: CupRounds['1/8'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.ManU,
          teamAway: teamMocks.Lazio,
          scoreFtHome: 4,
          scoreFtAway: 3,
        },
      ];
      yield [
        {
          _id: 16,
          netPosition: 6,
          tourNumber: CupRounds['1/8'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Borussia,
          teamAway: teamMocks.Liverpool,
          scoreFtHome: 4,
          scoreFtAway: 3,
        },
      ];
      yield [
        {
          _id: 17,
          netPosition: 7,
          tourNumber: CupRounds['1/8'],
          stateCode: GameState.CLOSED,
          teamHome: teamMocks.Bayern,
          teamAway: teamMocks.Napoli,
          scoreFtHome: 4,
          scoreFtAway: 3,
        },
      ];
    })(),
  };

  getGames(code: 'final' | '3rd_place' | '1/2' | '1/4' | '1/8') {
    return (this.games[code].next().value as any[]).map(g => new Game(g));
  }
}
