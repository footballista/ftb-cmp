import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { Collection, filter, Post, translations, userState } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
@Component({
  tag: 'ftb-media-news',
  styleUrl: 'ftb-media-news.component.scss',
  shadow: false,
})
export class FtbMediaNews {
  @Prop() news: Collection<Post>;
  @Prop() dataLoaded: boolean;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };
  private loaded$ = new AsyncSubject<boolean>();

  @Watch('dataLoaded') onDataLoaded() {
    this.loaded$.next(true);
    this.loaded$.complete();
  }

  render() {
    let filtersOn = false;
    const filterFn = async (_, query) => {
      if (!query) return this.news.items;
      await this.loaded$.toPromise();
      filtersOn = Boolean(query);
      return filter(this.news.items, query, ['title']);
    };

    return (
      <Host>
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
      </Host>
    );
  }
}
