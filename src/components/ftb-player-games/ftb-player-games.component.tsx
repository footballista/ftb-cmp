import { Component, Host, h, Prop, State } from '@stencil/core';
import { AsyncSubject } from 'rxjs';
import { filter, Season, translations, Player, PlayerService, Team, userState } from 'ftb-models';
import { CategoryInterface } from '../ftb-searchable-content/ftb-searchable-content.component';
import { FtbGameCardField } from '../ftb-game-card/ftb-game-card-fields';
import orderBy from 'lodash-es/orderBy';

@Component({
  tag: 'ftb-player-games',
  styleUrl: 'ftb-player-games.component.scss',
  shadow: false,
})
export class FtbPlayerGames {
  @Prop() player!: Player;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };
  @State() loaded = false;
  private ready$ = new AsyncSubject();

  componentWillLoad() {
    new PlayerService().loadPlayerGames(this.player._id).then(p => {
      this.player.games = p.games;
      this.loaded = true;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    const filterSeason = (games, seasonId) => (seasonId ? games.filter(g => g.game.season._id === seasonId) : games);
    const filterTeam = (games, teamId) => (teamId ? games.filter(g => g.stats.teamId === teamId) : games);
    const filterStats = (games, statsKey) => {
      if (statsKey == 'all_games') {
        return games;
      } else if (statsKey == 'with_goals_or_assists') {
        return games.filter(g => g.stats.goals || g.stats.assists);
      } else if (statsKey == 'with_cards') {
        return games.filter(g => g.stats.yellow || g.stats.red);
      } else {
        return games;
      }
    };

    let filtersOn = false;
    const filterFn = async (_, query: string, categories: CategoryInterface[]) => {
      const teamId = categories?.find(c => c.key === 'team')?.options.find(o => o.selected)?._id;
      const seasonId = categories?.find(c => c.key === 'season')?.options.find(o => o.selected)?._id;
      const statsKey = categories?.find(c => c.key === 'stats')?.options.find(o => o.selected)?.key;

      let items = this.player.games.items;
      items = filterTeam(items, teamId);
      items = filterSeason(items, seasonId);
      items = filterStats(items, statsKey);

      filtersOn = Boolean(query) || teamId || seasonId || statsKey;
      if (!filtersOn) return items;
      await this.ready$.toPromise();
      return filter(items, query, [
        'game.home.team.name',
        'game.home.team.shortName',
        'game.away.team.name',
        'game.away.team.shortName',
      ]);
    };

    const getCategories = (currentCategories?: CategoryInterface[]) => {
      const teamId = currentCategories?.find(c => c.key === 'team')?.options.find(o => o.selected)?._id;
      const seasonId = currentCategories?.find(c => c.key === 'season')?.options.find(o => o.selected)?._id;
      const statsKey = currentCategories?.find(c => c.key === 'stats')?.options.find(o => o.selected)?.key;

      const smap = {};
      filterStats(filterTeam(this.player.games.items, teamId), statsKey).forEach(g => {
        smap[g.game.season._id] ??= { lastDate: g.game.date, season: g.game.season };
        if (g.game.date > smap[g.game.season._id].lastDate) smap[g.game.season._id].lastDate = g.game.date;
      });
      const seasons = orderBy(Object.values(smap), ['lastDate'], ['desc']).map(row => row.season);

      const tmap = {};
      filterStats(filterSeason(this.player.games.items, seasonId), statsKey).forEach(g => {
        tmap[g.stats.teamId] ??= {
          lastDate: g.game.date,
          team: g.game.home.team._id == g.stats.teamId ? g.game.home.team : g.game.away.team,
        };
        if (g.game.date > tmap[g.stats.teamId].lastDate) tmap[g.stats.teamId].lastDate = g.game.date;
      });
      const teams = orderBy(Object.values(tmap), ['lastDate'], ['desc']).map(row => row.team);

      const stats = ['all_games'];
      filterTeam(filterSeason(this.player.games.items, seasonId), teamId).forEach(g => {
        if ((g.stats.goals || g.stats.assists) && !stats.includes('with_goals_or_assists')) {
          stats.push('with_goals_or_assists');
        }
        if ((g.stats.yellow || g.stats.red) && !stats.includes('with_cards')) {
          stats.push('with_cards');
        }
      });

      const categories = [];
      if (Object.values(smap).length > 1) {
        const seasonsCategory = {
          key: 'season',
          placeholder: translations.champ.search_by_champ_name[userState.language],
          filterFn: (query, options) => filter(options, query, ['text']),
          renderItem: s => <div class="season-option">{s.text}</div>,
          options: [
            { text: translations.champ.all_champs[userState.language] },
            ...seasons.map((o: Season) =>
              Object.assign(o, { text: o.champ.name + ' - ' + o.name, selected: o._id === seasonId }),
            ),
          ],
        };
        categories.push(seasonsCategory);
      }

      if (Object.values(tmap).length > 1) {
        const teamsCategory = {
          key: 'team',
          placeholder: translations.team.search_by_team_name[userState.language],
          filterFn: (query, options) => filter(options, query, ['name']),
          renderItem: (t: Team) => (
            <div class="team-option">
              {t._id && <ftb-team-logo team={t} key={t._id}></ftb-team-logo>}
              {t.name}
            </div>
          ),
          options: [
            { name: translations.team.all_teams[userState.language] },
            ...teams.map((o: Team) => Object.assign(o, { selected: o._id === teamId })),
          ],
        };
        categories.push(teamsCategory);
      }

      if (stats.length > 1) {
        const statsCategory = {
          key: 'stats',
          placeholder: translations.search.search[userState.language],
          filterFn: (query, options) => filter(options, query, ['text']),
          renderItem: s => <div class="stats-option">{s.text}</div>,
          options: [
            ...stats.map(key => ({
              key,
              text: translations.game[key][userState.language],
              selected: key === statsKey,
            })),
          ],
        };
        categories.push(statsCategory);
      }
      return categories;
    };

    return (
      <Host>
        <div class="ftb-player-games__wrapper">
          <div class="ftb-player-games__background">
            <ftb-searchable-content
              items={this.player.games.items}
              renderItems={items => (
                <ftb-pagination
                  totalItems={filtersOn ? items.length : this.player.games.total}
                  items={items}
                  renderItem={gs => (
                    <ftb-game-card
                      key={gs.game._id}
                      game={gs.game}
                      playerStats={gs.stats}
                      leftFields={[FtbGameCardField.date, FtbGameCardField.time, FtbGameCardField.stadium]}
                      topFields={[FtbGameCardField.champSeason, FtbGameCardField.round]}
                      rightFields={[FtbGameCardField.playerStats]}
                    ></ftb-game-card>
                  )}
                  rows={this.paginationConfig.rows}
                  fixedContainerHeightPx={this.paginationConfig.fixedContainerHeightPx}
                  itemMinWidthPx={this.paginationConfig.itemMinWidthPx}
                  itemMinHeightPx={this.paginationConfig.itemMinHeightPx}
                  stretchX={this.paginationConfig.stretchX}
                  stretchY={this.paginationConfig.stretchY}
                  XtoY={this.paginationConfig.XtoY}
                ></ftb-pagination>
              )}
              filterFn={filterFn}
              placeholder={translations.game.search_by_game_teams[userState.language]}
              getCategories={cc => getCategories(cc)}
            ></ftb-searchable-content>
          </div>
        </div>
      </Host>
    );
  }
}
