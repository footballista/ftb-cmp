import { Component, Host, h, Prop, State } from '@stencil/core';
import { Player } from 'ftb-models/dist/models/player.model';
import { AsyncSubject } from 'rxjs';
import { PlayerService } from 'ftb-models/dist/services/player.service';
import { diStore } from '@src/tools/di.store';
import { filter, Season, translations } from 'ftb-models';
import { CategoryInterface } from '@src/components/ftb-searchable-content/ftb-searchable-content.component';
import { Team } from 'ftb-models/dist/models/team.model';
import userState from '@src/tools/user.store';
import { FtbGameCardField } from '@src/components/ftb-game-card/ftb-game-card-fields';
import orderBy from 'lodash-es/orderBy';

@Component({
  tag: 'ftb-player-games',
  styleUrl: 'ftb-player-games.component.scss',
  shadow: false,
})
export class FtbPlayerGames {
  @Prop() player!: Player;
  @State() loaded = false;
  private ready$ = new AsyncSubject();

  componentWillLoad() {
    new PlayerService(diStore.gql).loadPlayerGames(this.player._id).then(p => {
      this.player.games = p.games;
      this.loaded = true;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    let filtersOn = false;
    const filterFn = async (_, query: string, categories: CategoryInterface[]) => {
      let items = this.player.games.items;
      const teamId = categories.find(c => c.key === 'team')?.options.find(o => o.selected)?._id;
      if (teamId) {
        items = items.filter(g => g.stats.teamId === teamId);
      }
      const seasonId = categories.find(c => c.key === 'season')?.options.find(o => o.selected)?._id;
      if (seasonId) {
        items = items.filter(g => g.game.season._id === seasonId);
      }

      filtersOn = Boolean(query) || teamId || seasonId;
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

      let games = this.player.games.items;
      if (seasonId) games = games.filter(g => g.game.season._id === seasonId);
      if (teamId) games = games.filter(g => g.stats.teamId === teamId);

      const smap = {};
      (teamId ? this.player.games.items.filter(g => g.stats.teamId === teamId) : this.player.games.items).forEach(g => {
        smap[g.game.season._id] ??= { lastDate: g.game.date, season: g.game.season };
        if (g.game.date > smap[g.game.season._id].lastDate) smap[g.game.season._id].lastDate = g.game.date;
      });
      const seasons = orderBy(Object.values(smap), ['lastDate'], ['desc']).map(row => row.season);

      const tmap = {};
      (seasonId
        ? this.player.games.items.filter(g => g.game.season._id === seasonId)
        : this.player.games.items
      ).forEach(g => {
        tmap[g.stats.teamId] ??= {
          lastDate: g.game.date,
          team: g.game.home.team._id == g.stats.teamId ? g.game.home.team : g.game.away.team,
        };
        if (g.game.date > tmap[g.stats.teamId].lastDate) tmap[g.stats.teamId].lastDate = g.game.date;
      });
      const teams = orderBy(Object.values(tmap), ['lastDate'], ['desc']).map(row => row.team);

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

      const seasonsCategory = {
        key: 'season',
        placeholder: translations.champ.search_by_champ_name[userState.language],
        filterFn: (query, options) => filter(options, query, ['text']),
        renderItem: s => <div class="season-option">{s.text}</div>,
        options: [
          { text: translations.champ.champs[userState.language] },
          ...seasons.map((o: Season) =>
            Object.assign(o, { text: o.champ.name + ' - ' + o.name, selected: o._id === seasonId }),
          ),
        ],
      };

      return [seasonsCategory, teamsCategory];
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
                      leftFields={[FtbGameCardField.date, FtbGameCardField.time, FtbGameCardField.stadium]}
                      topFields={[FtbGameCardField.champSeason, FtbGameCardField.round]}
                    ></ftb-game-card>
                  )}
                  rows={2}
                  itemMinWidthPx={266}
                  itemHeightPx={110}
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
