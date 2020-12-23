import { Component, h, Prop } from '@stencil/core';
import { League, Post, translations } from 'ftb-models';
import { LeagueService } from 'ftb-models/dist/services/league.service';
import { diStore } from '@src/tools/di.store';
import userState from '@src/tools/user.store';
@Component({
  tag: 'ftb-league-media-news-tab',
  styleUrl: 'ftb-league-media-news-tab.component.scss',
  shadow: false,
})
export class FtbLeagueMediaNewsTab {
  @Prop() league!: League;
  private filtersOn = false;
  private leagueService = new LeagueService(diStore.gql);
  private abortHttpController: AbortController;

  componentWillLoad() {
    for (let i = 0; i < this.league.news.total; i++) {
      this.league.news.items[i] ??= new Post({});
    }
  }

  private async filterFn(query) {
    this.abortHttpController?.abort();
    this.filtersOn = Boolean(query);
    if (this.filtersOn) {
      this.abortHttpController = new AbortController();
      const league = await this.leagueService.searchLeagueNews(this.league._id, query, this.abortHttpController.signal);
      return league.news.items;
    } else {
      return this.league.news.items;
    }
  }

  private async getItemsForInterval(items: Post[], offset: number, limit: number) {
    if (this.filtersOn) return items.slice(offset, offset + limit);

    this.abortHttpController?.abort();
    if (this.league.news.items.slice(offset, offset + limit).some(p => !p._id)) {
      this.abortHttpController = new AbortController();
      const league = await this.leagueService.loadLeagueNews(
        this.league._id,
        offset,
        limit,
        this.abortHttpController.signal,
      );
      this.league.news.items.splice(offset, limit, ...league.news.items);
      return this.league.news.items.slice(offset, offset + limit);
    } else {
      return this.league.news.items.slice(offset, offset + limit);
    }
  }

  render() {
    return (
      <ftb-searchable-content
        class="news-tab"
        key="league-news-pagination"
        items={this.league.news.items}
        filterFn={(_, q) => this.filterFn(q)}
        placeholder={translations.media.search_by_post_title[userState.language]}
        categories={[]}
        renderItems={items => (
          <ftb-pagination
            totalItems={this.filtersOn ? items.length : this.league.news.total}
            items={items}
            renderItem={(post: Post) => <ftb-post-cover key={'post_' + post._id} post={post}></ftb-post-cover>}
            getItemsForInterval={(i, o, l) => this.getItemsForInterval(i, o, l)}
            rows={1}
            itemMinWidthPx={200}
            itemHeightPx={150}
          ></ftb-pagination>
        )}
      ></ftb-searchable-content>
    );
  }
}
