import { Component, Host, h, Prop } from '@stencil/core';
import { Game, League, Post, translations } from 'ftb-models';
// import { GraphqlClient } from 'ftb-models/dist/tools/clients/graphql.client';
// import { HttpClient } from 'ftb-models/dist/tools/clients/http.client';
// import { User } from 'ftb-models/dist/models/user.model';
// import { LeagueService } from 'ftb-models/dist/services/league.service';
import userState from '@src/tools/user.store';
import { LeagueService } from 'ftb-models/dist/services/league.service';
import { diStore } from '@src/tools/di.store';

@Component({
  tag: 'ftb-league-media',
  styleUrl: 'ftb-league-media.component.scss',
  shadow: false,
})
export class FtbLeagueMedia {
  @Prop() league!: League;
  private leagueService = new LeagueService(diStore.gql);

  componentWillLoad() {
    for (let i = 0; i < this.league.news.total; i++) {
      this.league.news.items[i] ??= new Post({});
    }
  }

  render() {
    const tabs = [];
    if (this.league.news?.total) {
      tabs.push({
        renderTitle: () => translations.media.news[userState.language],
        renderContent: () => <ftb-league-media-news-tab league={this.league}></ftb-league-media-news-tab>,
      });
    }
    if (this.league.gamesWithPhotos?.total) {
      tabs.push({
        renderTitle: () => translations.media.photos[userState.language],
        renderContent: () => <ftb-league-media-photo-tab league={this.league}></ftb-league-media-photo-tab>,
      });
    }
    if (this.league.gamesWithVideos?.total) {
      tabs.push({
        renderTitle: () => translations.media.videos[userState.language],
        renderContent: () => this.renderVideoTab(),
      });
    }

    return (
      <Host>
        <div class="ftb-league-media__wrapper">
          <div class="ftb-league-media__background">
            <h2 class="component-header">{translations.media.latest_media[userState.language]}</h2>
            <div class="ftb-league-media__content">
              <ftb-tabs tabs={tabs}></ftb-tabs>
            </div>
          </div>
        </div>
      </Host>
    );
  }

  private renderVideoTab() {
    let filtersOn = false;
    const filterFn = async (_, query) => {
      const league = await this.leagueService.searchLeagueVideoGames(this.league._id, query);
      filtersOn = Boolean(query);
      return league.gamesWithVideos.items;
    };

    const renderVideoTitle = (game: Game) => (
      <div class="teams">
        {game.home.team.name} - {game.away.team.name}
      </div>
    );

    return (
      <ftb-searchable-content
        class="video-tab"
        key="league-video-pagination"
        items={this.league.gamesWithVideos.items}
        filterFn={filterFn}
        placeholder={translations.game.search_by_game_teams[userState.language]}
        categories={[]}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.league.gamesWithVideos.total}
            items={items}
            renderItem={(game: Game) => (
              <ftb-video
                key={'video_' + game._id}
                video={game.videos[game.videos.length - 1]}
                renderTitle={() => renderVideoTitle(game)}
              ></ftb-video>
            )}
            rows={1}
            itemMinWidthPx={200}
            itemHeightPx={150}
          ></ftb-pagination>
        )}
      ></ftb-searchable-content>
    );
  }
}
