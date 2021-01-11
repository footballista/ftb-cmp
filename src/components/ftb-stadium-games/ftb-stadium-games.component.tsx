import { Component, h, Host, Prop, State } from '@stencil/core';
import { filter, Game, Pitch, Stadium, translations } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
import { diStore } from '@src/tools/di.store';
import { StadiumService } from 'ftb-models/dist/services/stadium.service';
import { FtbGameCardField } from '@src/components/ftb-game-card/ftb-game-card-fields';
import userState from '@src/tools/user.store';
import { CategoryInterface } from '@src/components/ftb-searchable-content/ftb-searchable-content.component';

@Component({
  tag: 'ftb-stadium-games',
  styleUrl: 'ftb-stadium-games.component.scss',
  shadow: false,
})
export class FtbStadiumGames {
  @Prop() stadium!: Stadium;
  @State() loaded = false;
  private ready$ = new AsyncSubject();

  componentWillLoad() {
    new StadiumService(diStore.gql).loadStadiumGames(this.stadium._id).then(s => {
      this.stadium.upcomingGames = s.upcomingGames;
      this.stadium.playedGames = s.playedGames;
      this.loaded = true;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    const tabs = [];
    if (this.stadium.upcomingGames.total) {
      const cardFn = (game: Game) => (
        <ftb-game-card
          key={game._id}
          game={game}
          leftFields={[FtbGameCardField.date, FtbGameCardField.time, FtbGameCardField.pitch]}
          topFields={[FtbGameCardField.champSeason]}
        ></ftb-game-card>
      );
      tabs.push({
        renderTitle: () => translations.game.upcoming_games[userState.language],
        renderContent: () => this.renderTabContent('upcoming', this.stadium.upcomingGames, cardFn),
      });
    }
    if (this.stadium.playedGames.total) {
      const cardFn = (game: Game) => (
        <ftb-game-card
          key={game._id}
          game={game}
          leftFields={[FtbGameCardField.date, FtbGameCardField.time, FtbGameCardField.pitch]}
          topFields={[FtbGameCardField.champSeason]}
        ></ftb-game-card>
      );

      tabs.push({
        renderTitle: () => translations.game.played[userState.language],
        renderContent: () => this.renderTabContent('played', this.stadium.playedGames, cardFn),
      });
    }

    if (!tabs.length) return null;

    return (
      <Host>
        <div class="ftb-stadium-games__wrapper">
          <div class="ftb-stadium-games__background">
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
      const pitchId = categories.find(c => c.key === 'pitch')?.options.find(o => o.selected)?._id;
      if (pitchId) {
        items = items.filter(g => g.pitch?._id === pitchId);
      }
      filtersOn = Boolean(query) || pitchId;
      if (!filtersOn) return items;
      await this.ready$.toPromise();
      return filter(items, query, ['home.team.name', 'home.team.shortName', 'away.team.name', 'away.team.shortName']);
    };

    const categories = [];
    const pitchesMap = {};
    gamesCollection.items.forEach(g => {
      if (g.pitch) {
        pitchesMap[g.pitch._id] ??= g.pitch;
      }
    });
    if (Object.values(pitchesMap).length) {
      categories.push({
        key: 'pitch',
        placeholder: translations.stadium.search_by_pitch_name[userState.language],
        filterFn: (query, options) => filter(options, query, ['name']),
        renderItem: (p: Pitch) => <div class="pitch-option">{p.name}</div>,
        options: [{ name: translations.stadium.all_pitches[userState.language] }, ...Object.values(pitchesMap)],
      });
    }
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
        categories={categories}
      ></ftb-searchable-content>
    );
  }
}
