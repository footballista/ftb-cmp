import { Component, Host, h, Prop } from '@stencil/core';
import { Team } from 'ftb-models/dist/models/team.model';
import { filter, translations } from 'ftb-models';
import userState from '@src/tools/user.store';
import { Player } from 'ftb-models/dist/models/player.model';
import sortBy from 'lodash-es/sortBy';
import { getPlayerPosition, positions } from 'ftb-models/dist/tools/players-positions';

@Component({
  tag: 'ftb-team-roster',
  styleUrl: 'ftb-team-roster.component.scss',
  shadow: false,
})
export class FtbTeamRoster {
  @Prop() team!: Team;

  componentWillLoad() {
    this.team.players = sortBy(this.team.players, [
      p => positions[this.team.league.sports].indexOf(p.position),
      'number',
    ]);
  }

  render() {
    const filterFn = async (_, query, categories) => {
      let items = this.team.players;
      const position = categories.find(c => c.key === 'position')?.options.find(o => o.selected)?.key;
      if (position !== 'all') {
        items = items.filter(p => getPlayerPosition(p.position) == position);
      }
      return filter(items, query, ['firstName', 'middleName', 'lastName', 'number']);
    };

    const positionsMap = {};
    this.team.players.forEach(p => {
      if (getPlayerPosition(p.position)) {
        positionsMap[getPlayerPosition(p.position)] = true;
      }
    });

    const countByPosition = (pos: string) => {
      return this.team.players.filter(p => getPlayerPosition(p.position) == pos).length;
    };
    const categories = [
      {
        key: 'position',
        placeholder: translations.search.search[userState.language],
        filterFn: (query, options) => filter(options, query, ['translation']),
        renderItem: i => i.text,
        options: [
          { key: 'all', text: `All positions (${this.team.players.length})` },
          ...Object.keys(positionsMap).map(k => ({
            key: k,
            text:
              translations.position[this.team.league.sports][k + 's'][userState.language] + ` (${countByPosition(k)})`,
            translation: translations.position[this.team.league.sports][k + 's'][userState.language],
          })),
        ],
      },
    ];

    return (
      <Host>
        <div class="ftb-team-roster__wrapper">
          <div class="ftb-team-roster__background">
            <ftb-searchable-content
              items={this.team.players}
              filterFn={filterFn}
              placeholder={translations.player.search_by_player_name[userState.language]}
              categories={categories}
              renderItems={players => players.map(p => this.renderPlayer(p))}
            ></ftb-searchable-content>
          </div>
        </div>
      </Host>
    );
  }

  private renderPlayer(p: Player) {
    return (
      <div class="ftb-team-roster__player">
        <div class="ftb-team-roster__player-background">
          <div class="photo">
            <ftb-player-photo player={p} key={p._id}></ftb-player-photo>
          </div>

          <div class="info">
            <div class="name">
              {p.lastName} {p.firstName} {p.middleName}
            </div>
            <div class="age">
              {p.getAge() || '--'} {translations.player.y_o[userState.language].getForm(p.getAge() || 0)}
            </div>
          </div>
          {p.teams.length > 1 &&
            p.teams
              .filter(t => t._id != this.team._id)
              .map(t => (
                <div class="team">
                  <ftb-team-logo
                    team={t}
                    caption={translations.player.also_playing_in[userState.language] + ' ' + t.name}
                  ></ftb-team-logo>
                </div>
              ))}

          <div class="position">{p.position}</div>
          <div class="number">#{p.number}</div>
        </div>
      </div>
    );
  }
}
