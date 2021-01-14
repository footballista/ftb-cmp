import { Component, Host, h, Prop, State } from '@stencil/core';
import { Season, translations, filter, SeasonService, diState, userState, Team, SeasonPlayerStats } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
import orderBy from 'lodash-es/orderBy';
import { CategoryInterface } from '@src/components/ftb-searchable-content/ftb-searchable-content.component';

@Component({
  tag: 'ftb-season-best-players',
  styleUrl: 'ftb-season-best-players.component.scss',
  shadow: false,
})
export class FtbSeasonBestPlayers {
  @Prop() season!: Season;
  @State() tabs = [];
  @State() loaded = false;
  ready$ = new AsyncSubject<boolean>();

  componentWillLoad() {
    this.divideCategories();
    new SeasonService(diState.gql).loadSeasonPlayersStats(this.season._id).then(s => {
      this.season.playersStats = s.playersStats;
      this.divideCategories();
      this.loaded = true;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  private divideCategories() {
    this.season.playersStats.forEach(s => (s.goals_assists = s.goals + s.assists));

    const categories = [
      'goals',
      'assists',
      'goals_assists',
      'points',
      'yellowCards',
      'redCards',
      'allFouls',
      'losses',
      'steals',
      'rebounds',
      'blocks',
      'aces',
    ].map(key => {
      return {
        key,
        items: orderBy(
          this.season.playersStats.filter(s => s[key]),
          [key],
          ['desc'],
        ),
      };
    });

    this.tabs = categories
      .filter(c => c.items.length)
      .map(c => ({
        renderTitle: () => translations.game.preview[c.key][userState.language],
        renderContent: () => this.renderCategory(c.key, c.items),
      }));
  }

  render() {
    if (!this.tabs.length) return null;

    return (
      <Host>
        <div class="ftb-season-best-players__wrapper">
          <div class="ftb-season-best-players__background">
            <ftb-tabs tabs={this.tabs}></ftb-tabs>
          </div>
        </div>
      </Host>
    );
  }

  renderCategory(key: string, rows: SeasonPlayerStats[]) {
    let filtersOn = false;

    const cardFn = (row: SeasonPlayerStats) => {
      return (
        <ftb-link
          route="player"
          params={{ playerId: row.player._id, playerName: row.player.firstName + ' ' + row.player.lastName }}
        >
          <div class="ftb-season-best-players__player-card">
            <div class="ftb-season-best-players__player-card-background">
              <ftb-player-photo player={row.player}></ftb-player-photo>
              <div class="info">
                <div class="name">
                  {row.player.firstName} {row.player.lastName}
                </div>
                <div class="parameters">
                  <div class="parameter">
                    <span class="value">{row[key]}</span>
                    <span class="label">{translations.player.stats[key][userState.language].getForm(row[key])}</span>
                  </div>
                </div>
              </div>
              <div class="teams">
                {row.player.teams.map(t => (
                  <ftb-team-logo team={t} key={t._id}></ftb-team-logo>
                ))}
              </div>
            </div>
          </div>
        </ftb-link>
      );
    };
    const filterFn = async (_, query: string, categories: CategoryInterface[]) => {
      let items = rows;
      const teamId = categories.find(c => c.key === 'team')?.options.find(o => o.selected)?._id;
      if (teamId) {
        items = items.filter(s => s.player.teams.some(t => t._id == teamId));
      }
      filtersOn = Boolean(query) || teamId;
      if (!filtersOn) return items;
      await this.ready$.toPromise();
      return filter(items, query, ['player.firstName', 'player.lastName']);
    };
    const teamsMap = {};
    rows.forEach(({ player }) => {
      player.teams.forEach(t => (teamsMap[t._id] ??= t));
    });

    const categories = [
      {
        key: 'team',
        lsKey: 'ftb::season-best-players::team',
        placeholder: translations.team.search_by_team_name[userState.language],
        filterFn: (query, options) => filter(options, query, ['name']),
        renderItem: (t: Team) => (
          <div class="team-option">
            {t._id && <ftb-team-logo team={t} key={t._id}></ftb-team-logo>}
            {t.name}
          </div>
        ),
        options: [{ name: translations.team.all_teams[userState.language] }, ...Object.values(teamsMap)],
      },
    ];

    return (
      <ftb-searchable-content
        key={key + rows.length}
        items={rows}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : rows.length}
            items={items}
            renderItem={cardFn}
            rows={3}
            itemMinWidthPx={266}
            itemHeightPx={66}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.player.search_by_player_name[userState.language]}
        categories={categories}
      ></ftb-searchable-content>
    );
  }
}
