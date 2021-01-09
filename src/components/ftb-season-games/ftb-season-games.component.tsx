import { Component, h, Host, Prop, State } from '@stencil/core';
import { filter, Game, GameState, Season, Stage, translations } from 'ftb-models';
import userState from '@src/tools/user.store';
import { AsyncSubject } from 'rxjs';
import { SeasonService } from 'ftb-models/dist/services/season.service';
import { diStore } from '@src/tools/di.store';
import { FtbGameCardField } from '@src/components/ftb-game-card/ftb-game-card-fields';
import orderBy from 'lodash-es/orderBy';
import { Team } from 'ftb-models/dist/models/team.model';
import { CategoryInterface } from '@src/components/ftb-searchable-content/ftb-searchable-content.component';

@Component({
  tag: 'ftb-season-games',
  styleUrl: 'ftb-season-games.component.scss',
  shadow: false,
})
export class FtbSeasonGames {
  @Prop() season!: Season;
  @State() loaded = false;
  private ready$ = new AsyncSubject();

  componentWillLoad() {
    this.sortGames();
    new SeasonService(diStore.gql).loadSeasonCalendar(this.season._id).then(s => {
      this.season.calendar = s.calendar;
      this.season.upcomingGames.items = s.calendar.items.filter(g => g.state < GameState.CLOSED && g.date && g.stadium);
      this.season.playedGames.items = s.calendar.items.filter(g => g.state === GameState.CLOSED && g.date);
      this.sortGames();
      this.loaded = true;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  private sortGames() {
    this.season.upcomingGames.items = orderBy(this.season.upcomingGames.items, ['date'], ['asc']);
    this.season.playedGames.items = orderBy(this.season.playedGames.items, ['date'], ['desc']);
    const stagesMap = {};
    this.season.stages.forEach(s => {
      stagesMap[s._id] = s;
    });
    const extractSortedTour = (g: Game) => {
      if (stagesMap[g.stage._id].format !== 'cup') {
        return g.tourNumber;
      } else {
        if (g.tourNumber == 11) {
          return -0.5;
        } else {
          return -g.tourNumber;
        }
      }
    };
    this.season.calendar.items = orderBy(
      this.season.calendar.items,
      [g => stagesMap[g.stage._id].sortIdx, g => extractSortedTour(g)],
      ['desc', 'asc'],
    );
  }

  render() {
    const tabs = [];
    if (this.season.upcomingGames.total) {
      const cardFn = (game: Game) => (
        <ftb-game-card
          key={game._id}
          game={game}
          leftFields={[]}
          topFields={[FtbGameCardField.date, FtbGameCardField.round]}
          rightFields={[FtbGameCardField.time, FtbGameCardField.stadium]}
        ></ftb-game-card>
      );
      tabs.push({
        renderTitle: () => translations.game.upcoming_games[userState.language],
        renderContent: () => this.renderTabContent('upcoming', this.season.upcomingGames, cardFn),
      });
    }
    if (this.season.playedGames.total) {
      const cardFn = (game: Game) => (
        <ftb-game-card
          key={game._id}
          game={game}
          leftFields={[]}
          topFields={[FtbGameCardField.date, FtbGameCardField.round]}
        ></ftb-game-card>
      );

      tabs.push({
        renderTitle: () => translations.game.played[userState.language],
        renderContent: () => this.renderTabContent('played', this.season.playedGames, cardFn),
      });
    }
    if (this.season.calendar.total) {
      const cardFn = (game: Game) => (
        <ftb-game-card
          key={game._id}
          game={game}
          leftFields={[]}
          topFields={[FtbGameCardField.date, FtbGameCardField.round]}
        ></ftb-game-card>
      );

      tabs.push({
        renderTitle: () =>
          this.season.upcomingGames.total || this.season.playedGames.total
            ? translations.game.full_calendar[userState.language]
            : translations.game.calendar[userState.language],
        renderContent: () => this.renderTabContent('calendar', this.season.calendar, cardFn),
      });
    }

    if (!tabs.length) return null;

    return (
      <Host>
        <div class="ftb-season-games__wrapper">
          <div class="ftb-season-games__background">
            <ftb-tabs tabs={tabs}></ftb-tabs>
          </div>
        </div>
      </Host>
    );
  }

  private renderTabContent(
    key: string,
    gamesCollection: { total: number; items: Game[] },
    cardFn: (g: Game) => string,
  ) {
    let filtersOn = false;
    const filterFn = async (_, query: string, categories: CategoryInterface[]) => {
      let items = gamesCollection.items;
      const stageId = categories.find(c => c.key === 'stage')?.options.find(o => o.selected)?._id;
      if (stageId) {
        items = items.filter(g => g.stage._id === stageId);
      }

      const teamId = categories.find(c => c.key === 'team')?.options.find(o => o.selected)?._id;
      if (teamId) {
        items = items.filter(g => g.home.team._id === teamId || g.away.team._id === teamId);
      }
      filtersOn = Boolean(query) || stageId || teamId;
      if (!filtersOn) return items;
      await this.ready$.toPromise();
      return filter(items, query, ['home.team.name', 'home.team.shortName', 'away.team.name', 'away.team.shortName']);
    };

    const getCategories = (currentCategories?: CategoryInterface[]) => {
      const stageId = currentCategories?.find(c => c.key === 'stage')?.options.find(o => o.selected)?._id;
      const teamId = currentCategories?.find(c => c.key === 'team')?.options.find(o => o.selected)?._id;

      const extractStages = (games: Game[]): Stage[] => {
        const map = {};
        games.forEach(g => (map[g.stage._id] ??= this.season.stages.find(s => s._id === g.stage._id)));
        return Object.values(map);
      };

      const games = !stageId ? gamesCollection.items : gamesCollection.items.filter(g => g.stage._id === stageId);
      const teamsMap: { [_id: number]: Team } = {};
      games.forEach(g => {
        teamsMap[g.home.team._id] ??= g.home.team;
        teamsMap[g.away.team._id] ??= g.away.team;
      });

      const categories: CategoryInterface[] = [
        {
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
            ...Object.values(teamsMap).map(o => Object.assign(o, { selected: o._id === teamId })),
          ],
        },
      ];

      if (this.season.stages.length > 1) {
        const stages = !teamId
          ? extractStages(gamesCollection.items)
          : extractStages(gamesCollection.items.filter(g => g.home.team._id === teamId || g.away.team._id === teamId));
        categories.push({
          key: 'stage',
          placeholder: translations.champ.search_by_stage_name[userState.language],
          filterFn: (query, options) => filter(options, query, ['name']),
          renderItem: (s: Stage) => <div class="stage-option">{s.name}</div>,
          options: [{ name: translations.champ.all_stages[userState.language] }, ...stages],
        });
      }

      return categories;
    };

    return (
      <ftb-searchable-content
        key={key}
        items={gamesCollection.items}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : gamesCollection.total}
            items={items}
            renderItem={cardFn}
            rows={2}
            itemMinWidthPx={200}
            itemHeightPx={110}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.game.search_by_game_teams[userState.language]}
        getCategories={cc => getCategories(cc)}
      ></ftb-searchable-content>
    );
  }
}
