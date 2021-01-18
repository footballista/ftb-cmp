import { Component, Host, h, Prop } from '@stencil/core';
import { filter, translations, Team, userState, Player, getPlayerPosition, positions } from 'ftb-models';
import sortBy from 'lodash-es/sortBy';

@Component({
  tag: 'ftb-team-roster',
  styleUrl: 'ftb-team-roster.component.scss',
  shadow: false,
})
export class FtbTeamRoster {
  @Prop() team!: Team;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };

  componentWillLoad() {
    this.team.players = sortBy(this.team.players, [
      p => positions[this.team.league.sports].indexOf(p.position),
      'number',
    ]);
  }

  render() {
    let filtersOn = false;
    const filterFn = async (_, query, categories) => {
      let items = this.team.players;
      const position = categories.find(c => c.key === 'position')?.options.find(o => o.selected)?.key;
      if (position !== 'all') {
        items = items.filter(p => getPlayerPosition(p.position) == position);
      }
      filtersOn = Boolean(query) || position !== 'all';
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
              renderItems={items => (
                <ftb-pagination
                  totalItems={filtersOn ? items.length : this.team.players.length}
                  items={items}
                  renderItem={(p: Player) => this.renderPlayer(p)}
                  rows={this.paginationConfig.rows}
                  fixedContainerHeightPx={this.paginationConfig.fixedContainerHeightPx}
                  itemMinWidthPx={this.paginationConfig.itemMinWidthPx}
                  itemMinHeightPx={this.paginationConfig.itemMinHeightPx}
                  stretchX={this.paginationConfig.stretchX}
                  stretchY={this.paginationConfig.stretchY}
                  XtoY={this.paginationConfig.XtoY}
                ></ftb-pagination>
              )}
            ></ftb-searchable-content>
          </div>
        </div>
      </Host>
    );
  }

  private renderPlayer(p: Player) {
    return (
      <ftb-link route="player" params={{ playerId: p._id, playerName: p.firstName + ' ' + p.lastName }}>
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
      </ftb-link>
    );
  }
}
