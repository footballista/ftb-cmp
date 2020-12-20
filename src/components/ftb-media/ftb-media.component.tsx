import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { Game, Post, translations, filter } from 'ftb-models';
import { Collection } from 'ftb-models/dist/models/base/collection';
import userState from '@src/tools/user.store';
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
        key="league-news-pagination"
        items={this.news.items}
        filterFn={filterFn}
        placeholder={translations.media.search_by_post_title[userState.language]}
        categories={[]}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.news.total}
            items={items}
            renderItem={(post: Post) => <div>{post.title}</div>}
            rows={3}
            itemMinWidthPx={200}
            itemHeightPx={68}
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
        renderItems={items => (
          <ftb-pagination
            key="league-photo-pagination"
            totalItems={filtersOn ? items.length : this.photoGames.total}
            items={items}
            renderItem={(game: Game) => (
              <div>
                {game.home.team.name} - {game.away.team.name}
              </div>
            )}
            rows={1}
            itemMinWidthPx={200}
            itemHeightPx={200}
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
    return (
      <ftb-searchable-content
        class="video-tab"
        key="league-video-pagination"
        items={this.videoGames.items}
        filterFn={filterFn}
        placeholder={translations.game.search_by_game_teams[userState.language]}
        categories={[]}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.videoGames.total}
            items={items}
            renderItem={(game: Game) => (
              <div>
                {game.videos.map(v => (
                  <div>
                    {game.home.team.name} - {game.away.team.name} {v.name}
                  </div>
                ))}
              </div>
            )}
            rows={1}
            itemMinWidthPx={200}
            itemHeightPx={200}
          ></ftb-pagination>
        )}
      ></ftb-searchable-content>
    );
  }
}
