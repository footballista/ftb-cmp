import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';
import { AsyncSubject } from 'rxjs';

@Component({
  tag: 'ftb-pagination',
  styleUrl: 'ftb-pagination.component.scss',
  shadow: false,
})
export class FtbPagination {
  @Prop() totalItems: number;
  @Prop() items: any[];
  @Prop() rows!: number;
  @Prop() itemMinWidthPx!: number;
  @Prop() itemHeightPx!: number;
  @Prop() renderItem!: (item) => string;
  @State() displayItems: any[];
  @Element() element: HTMLElement;
  private pageLoaded: boolean;
  private itemMaxWidthPx: number;
  private itemsPerPage: number;
  private wrapperHeight: number;
  private totalPages: number;
  private currentPage: number = 0;
  private resizeObserver: ResizeObserver;
  private ready$ = new AsyncSubject();

  async componentWillLoad() {
    this.resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });
    this.resizeObserver.observe(this.element);
    await this.ready$.toPromise();
  }

  componentWillUpdate() {
    this.defineDisplayedItems();
  }

  private onResize() {
    const itemsPerRow = Math.floor(this.element.offsetWidth / this.itemMinWidthPx);
    this.itemMaxWidthPx = this.element.offsetWidth / itemsPerRow;

    this.itemsPerPage = itemsPerRow * this.rows;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const maxDisplayedRows = Math.min(this.rows, Math.ceil(this.totalItems / itemsPerRow));
    this.wrapperHeight = this.itemHeightPx * maxDisplayedRows;
    this.defineDisplayedItems();

    this.ready$.next(true);
    this.ready$.complete();
  }

  private onPageSelected(page: number) {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.defineDisplayedItems();
    }
  }

  private defineDisplayedItems() {
    const offset = this.currentPage * this.itemsPerPage;
    const limit = offset + this.itemsPerPage;
    if (this.totalItems === this.items.length || this.items.length >= limit) {
      this.displayItems = this.items.slice(offset, limit);
      this.pageLoaded = true;
    } else {
      this.displayItems = [];
      this.pageLoaded = false;
    }
  }

  private getDisplayedPages(): Array<number | null> {
    const displayedPages = [0];
    if (this.currentPage === 0) {
      if (this.totalPages > 2) displayedPages.push(1);
      if (this.totalPages > 3) displayedPages.push(2);
    } else if (this.currentPage === this.totalPages - 1) {
      if (this.totalPages > 3) displayedPages.push(this.totalPages - 3);
      if (this.totalPages > 2) displayedPages.push(this.totalPages - 2);
    } else {
      [this.currentPage - 1, this.currentPage, this.currentPage + 1].forEach(p => {
        if (p > 0 && p < this.totalPages - 1) displayedPages.push(p);
      });
    }
    displayedPages.push(this.totalPages - 1);

    const displayedEntities = [];
    for (let i = 0; i < displayedPages.length; i++) {
      displayedEntities.push(displayedPages[i]);
      if (displayedPages[i + 1] - displayedPages[i] > 1) {
        displayedEntities.push(null);
      }
    }
    return displayedEntities;
  }

  render() {
    return (
      <Host>
        <div class="ftb-pagination-items-wrapper" style={{ height: this.wrapperHeight + 'px' }}>
          {this.pageLoaded ? (
            this.displayItems.map(i => (
              <div
                class="item"
                style={{
                  'min-width': this.itemMinWidthPx + 'px',
                  'max-width': this.itemMaxWidthPx + 'px',
                  'height': this.itemHeightPx + 'px',
                }}
              >
                {this.renderItem(i)}
              </div>
            ))
          ) : (
            <div class="spinner-container">
              <ftb-spinner></ftb-spinner>
            </div>
          )}
        </div>
        {this.totalPages > 1 && (
          <div class="ftb-pagination-pages-wrapper">
            {this.getDisplayedPages().map(p =>
              p === null ? (
                <div>...</div>
              ) : (
                <div class={{ page: true, selected: this.currentPage === p }} onClick={() => this.onPageSelected(p)}>
                  {p + 1}
                </div>
              ),
            )}
          </div>
        )}
      </Host>
    );
  }
}
