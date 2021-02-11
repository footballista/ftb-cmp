import { Component, h, Prop } from '@stencil/core';
import { League, Post, translations, LeagueService, userState } from 'ftb-models';

@Component({
  tag: 'ftb-league-media-news-tab',
  styleUrl: 'ftb-league-media-news-tab.component.scss',
  shadow: false,
})
export class FtbLeagueMediaNewsTab {
  @Prop() league!: League;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };

  private filtersOn = false;
  private leagueService = new LeagueService();
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
    );
  }
}
