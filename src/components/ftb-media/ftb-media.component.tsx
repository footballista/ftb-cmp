import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { Game, Post, translations, filter, Collection, userState } from 'ftb-models';
import { AsyncSubject } from 'rxjs';

@Component({
  tag: 'ftb-media',
  styleUrl: 'ftb-media.component.scss',
  shadow: false,
})
export class FtbMedia {
  @Prop() news: Collection<Post>;
  @Prop() photoGames: Collection<Game>;
  @Prop() videoGames: Collection<Game>;
  @Prop() dataLoaded: boolean;
  private loaded$ = new AsyncSubject<boolean>();

  @Watch('dataLoaded') onDataLoaded() {
    this.loaded$.next(true);
    this.loaded$.complete();
  }

  render() {
    const tabs = [];
    if (this.news?.total) {
      tabs.push({
        renderTitle: () => translations.media.news[userState.language],
        renderContent: () => this.renderNewsTab(),
      });
    }
    if (this.photoGames?.total) {
      tabs.push({
        renderTitle: () => translations.media.photos[userState.language],
        renderContent: () => this.renderPhotoTab(),
      });
    }
    if (this.videoGames?.total) {
      tabs.push({
        renderTitle: () => translations.media.videos[userState.language],
        renderContent: () => this.renderVideoTab(),
      });
    }
    return (
      <Host>
        <ftb-tabs tabs={tabs}></ftb-tabs>
      </Host>
    );
  }

  private renderNewsTab() {
    let filtersOn = false;
    const filterFn = async (_, query) => {
      if (!query) return this.news.items;
      await this.loaded$.toPromise();
      filtersOn = Boolean(query);
      return filter(this.news.items, query, ['title']);
    };

    return (
      <ftb-searchable-content
        class="news-tab"
        items={this.news.items}
        filterFn={filterFn}
        placeholder={translations.media.search_by_post_title[userState.language]}
        categories={[]}
        key={'league-news-searchable' + (this.dataLoaded ? '1' : '0')}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.news.total}
            items={items}
            renderItem={(post: Post) => <ftb-post-cover key={'post_' + post._id} post={post}></ftb-post-cover>}
            rows={1}
            itemMinWidthPx={200}
            itemHeightPx={150}
          ></ftb-pagination>
        )}
      ></ftb-searchable-content>
    );
  }

  private renderPhotoTab() {
    let filtersOn = false;
    const filterFn = async (_, query) => {
      if (!query) return this.photoGames.items;
      await this.loaded$.toPromise();
      filtersOn = Boolean(query);
      return filter(this.photoGames.items, query, ['home.team.name', 'away.team.name']);
    };
    return (
      <ftb-searchable-content
        class="photo-tab"
        items={this.photoGames.items}
        filterFn={filterFn}
        placeholder={translations.game.search_by_game_teams[userState.language]}
        categories={[]}
        key={'league-photo-searchable' + (this.dataLoaded ? '1' : '0')}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.photoGames.total}
            items={items}
            renderItem={(game: Game) => (
              <ftb-game-photo-cover game={game} key={'photo_' + game._id}></ftb-game-photo-cover>
            )}
            rows={1}
            itemMinWidthPx={200}
            itemHeightPx={150}
          ></ftb-pagination>
        )}
      ></ftb-searchable-content>
    );
  }

  private renderVideoTab() {
    let filtersOn = false;
    const filterFn = async (_, query) => {
      if (!query) return this.videoGames.items;
      await this.loaded$.toPromise();
      filtersOn = Boolean(query);
      return filter(this.videoGames.items, query, ['home.team.name', 'away.team.name']);
    };

    const renderVideoTitle = (game: Game) => (
      <div class="teams">
        {game.home.team.name} - {game.away.team.name}
      </div>
    );

    return (
      <ftb-searchable-content
        class="video-tab"
        items={this.videoGames.items}
        filterFn={filterFn}
        placeholder={translations.game.search_by_game_teams[userState.language]}
        categories={[]}
        key={'league-video-searchable' + (this.dataLoaded ? '1' : '0')}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.videoGames.total}
            items={items}
            renderItem={(game: Game) => (
              <ftb-video
                key={'video_' + game._id}
                video={game.videos[game.videos.length - 1]}
                renderTitle={() => renderVideoTitle(game)}
              ></ftb-video>
            )}
            rows={1}
            itemMinWidthPx={266}
            itemHeightPx={150}
          ></ftb-pagination>
        )}
      ></ftb-searchable-content>
    );
  }
}
