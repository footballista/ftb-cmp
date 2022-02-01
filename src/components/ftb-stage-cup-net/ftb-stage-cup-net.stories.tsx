import { Component, h, Host } from '@stencil/core';
import { CupRounds, Game, GameState, Stage, StageFormat, Team, teamMocks } from 'ftb-models';

@Component({
  tag: 'ftb-stage-cup-net-stories',
  styleUrl: 'ftb-stage-cup-net.stories.scss',
  shadow: false,
})
export class FtbStageCupNetStories {
  render() {
    return (
      <Host>
        <h1>Cup net</h1>
        <ftb-code-snippet code="<ftb-cup-net stage={stage} />" />
        <ftb-cup-net stage={createStage('final', '1/2', '1/2', '1/4', '1/4', '1/4', '1/4')} />

        <h2>Split sides</h2>
        <p>
          Big structures will be divided horizontally. You can also pass{' '}
          <pre class="inline-code">
            <code>splitSidesThreshold</code> to override division rule
          </pre>
        </p>
        <ftb-code-snippet code="<ftb-cup-net stage={stage}  splitSidesThreshold={16} />" />
        <ftb-cup-net
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
        />

        <h2>Highlight team</h2>
        <p>You can programmatically set team to highlight on the net</p>
        <ftb-code-snippet code="<ftb-cup-net stage={stage} highlightTeam={new Team({_id: 123, name: 'Arsenal'})}/>" />
        <ftb-cup-net
          stage={createStage('final', '1/2', '1/2', '1/4', '1/4', '1/4', '1/4')}
          highlightTeam={new Team(teamMocks.Arsenal)}
        />

        <h2>Highlight many teams</h2>
        <p>You can programmatically set team to highlight on the net</p>
        <ftb-code-snippet code="<ftb-cup-net stage={stage} highlightTeams={new Team({_id: 123, name: 'Arsenal'}), new Team({_id: 124, name: 'Chelsea'}), new Team({_id: 125, name: Borussia Dortmund})}/>" />
        <ftb-cup-net
          stage={createStage('final', '1/2', '1/2', '1/4', '1/4', '1/4', '1/4')}
          highlightTeams={[new Team(teamMocks.Arsenal), new Team(teamMocks.Chelsea), new Team(teamMocks.Borussia)]}
        />

        <h2>Autofill rounds</h2>
        <p>Rounds that aren't set yet, will be autofilled with empty elements</p>
        <ftb-cup-net stage={createStage('1/4', '1/4', '1/4', '1/4')} />

        <h2>Ternary structure</h2>
        <p>Alternative net structure with rounds like "1/3", "1/6", "1/12" will have different appearance:</p>
        <ftb-code-snippet code="UNDER CONSTRUCTION" />
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
