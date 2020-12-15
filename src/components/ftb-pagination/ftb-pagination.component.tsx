import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';
import { AsyncSubject } from 'rxjs';
import userState from '@src/tools/user.store';
import { translations } from 'ftb-models';
import Chevron from '../../assets/icons/chevron-down.svg';

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
  @Prop() stretchItems = true;
  @Prop() currentIdx: number = 0;
  @State()
  displayItems: any[];
  @Element() element: HTMLElement;
  private pageLoaded: boolean;
  private itemMaxWidthPx: number;
  private itemsPerPage: number;
  private wrapperHeightPx: number;
  private wrapperWidthPx: number;
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
    this.defineTotalPages();
    this.defineDisplayedItems();
  }

  private onResize() {
    this.wrapperWidthPx = this.element.offsetWidth || this.itemMinWidthPx;
    const itemsPerRow = Math.floor(this.wrapperWidthPx / this.itemMinWidthPx);
    this.itemMaxWidthPx = this.stretchItems ? this.wrapperWidthPx / itemsPerRow : this.itemMinWidthPx;
    this.itemsPerPage = itemsPerRow * this.rows;
    if (!this.wrapperHeightPx) {
      const maxDisplayedRows = Math.min(this.rows, Math.ceil(this.totalItems / itemsPerRow));
      this.wrapperHeightPx = this.itemHeightPx * maxDisplayedRows;
    }
    this.defineTotalPages();
    this.defineDisplayedItems();

    this.ready$.next(true);
    this.ready$.complete();
  }

  private onPageSelected(page: number) {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.currentIdx = this.currentPage * this.itemsPerPage;
      this.defineDisplayedItems();
    }
  }

  private defineTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
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
    this.currentPage = Math.floor(this.currentIdx / this.itemsPerPage);

    return (
      <Host>
        <div
          class="ftb-pagination__items-wrapper"
          style={{ height: this.wrapperHeightPx + 'px', width: this.wrapperWidthPx + 'px' }}
        >
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

        <div class={{ 'ftb-pagination__pages-wrapper': true, 'empty': this.totalPages <= 1 }}>
          <div class="button-wrapper">
            {this.currentPage > 0 && (
              <button class="nav-button prev" onClick={() => this.onPageSelected(this.currentPage - 1)}>
                <ftb-icon svg={Chevron}></ftb-icon>
                {translations.navigation.prev[userState.language]}
              </button>
            )}
          </div>
          <div class="pages">
            {this.totalPages > 1 &&
              this.getDisplayedPages().map(p =>
                p === null ? (
                  <div>...</div>
                ) : (
                  <div
                    class={{ page: true, selected: this.currentPage === p }}
                    onClick={() => this.onPageSelected(this.currentPage - 1)}
                  >
                    {p + 1}
                  </div>
                ),
              )}
          </div>
          <div class="button-wrapper">
            {this.currentPage < this.totalPages - 1 && (
              <button class="nav-button next" onClick={() => this.onPageSelected(this.currentPage + 1)}>
                {translations.navigation.next[userState.language]}
                <ftb-icon svg={Chevron}></ftb-icon>
              </button>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
