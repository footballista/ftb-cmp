import { Component, Host, h, Prop, State, Watch, Element } from '@stencil/core';
import Chevron from '../../assets/icons/chevron-down.svg';
import { translations, userState } from 'ftb-models';
@Component({
  tag: 'ftb-pagination',
  styleUrl: 'ftb-pagination.component.scss',
  shadow: false,
})
export class FtbPagination2 {
  /** items to render */
  @Prop() items!: any[];
  /** total number of items (this.items.length might be less if not fully loaded) */
  @Prop() totalItems!: number;
  /** minimal possible width of item container */
  @Prop() itemMinWidthPx!: number;
  /** minimal possible height of item container */
  @Prop() itemMinHeightPx!: number;
  /** Number of rows to display. Either this, or "fixedContainerHeightPx" should be provided */
  @Prop() rows: number;
  /** Use this if container height is predefined. Otherwise provide "rows" property */
  @Prop() fixedContainerHeightPx: number;
  /** whether elements could be stretched horizontally */
  @Prop() stretchX: boolean;
  /** whether elements could be stretched vertically */
  @Prop() stretchY: boolean;
  /** calculate item Width based on Height. [Width = Height * XtoY] */
  @Prop() XtoY: number;
  /** jsx render item func */
  @Prop() renderItem!: (item) => string | string[];
  /** changing pages from outside */
  @Prop() currentIdx: number = 0;
  /** optional render function for interval. Might be useful when each page is loaded separately from server */
  @Prop() getItemsForInterval: (items: any[], offset: number, limit: number) => Promise<any[]>;

  @State() dimensions: {
    rows: number;
    pages: number;
    containerHeightPx: number;
    containerWidthPx: number;
    itemHeightPx: number;
    itemWidthPx: number;
    itemsPerRow: number;
    itemsPerPage: number;
  } = {
    rows: 0,
    pages: 0,
    containerHeightPx: 0,
    containerWidthPx: 0,
    itemWidthPx: 0,
    itemsPerRow: 0,
    itemsPerPage: 0,
    itemHeightPx: 0,
  };

  @State() state: {
    currentPage: number;
    currentItem: number;
    pageLoaded: boolean;
    displayedItems: any[];
  } = {
    currentPage: 0,
    currentItem: 0,
    pageLoaded: false,
    displayedItems: [],
  };

  @Element() element: HTMLDivElement;

  async componentWillLoad() {
    this.defineDimensions();
    await this.onCurrentIdxChange();
  }

  @Watch('currentIdx') async onCurrentIdxChange() {
    this.state.currentItem = this.currentIdx;
    this.state.currentPage = Math.floor(this.state.currentItem / this.dimensions.itemsPerPage);
    return this.defineDisplayedItems();
  }

  @Watch('items') onItemsChange() {
    this.defineTotalPages();
  }

  /**
   * calculating height and width of container and each item
   */
  defineDimensions() {
    this.dimensions.containerWidthPx = this.element.clientWidth || this.itemMinWidthPx;
    this.dimensions.itemsPerRow = Math.floor(this.dimensions.containerWidthPx / this.itemMinWidthPx);
    if (this.fixedContainerHeightPx) {
      this.dimensions.containerHeightPx = this.fixedContainerHeightPx;
      this.dimensions.rows = Math.floor(this.dimensions.containerHeightPx / this.itemMinHeightPx);
    } else if (!this.dimensions.containerHeightPx) {
      // do not recalculate height if already set. otherwise height will differ on items property changes (when running filters)
      const maxDisplayedRows = Math.min(this.rows, Math.ceil(this.totalItems / this.dimensions.itemsPerRow));
      this.dimensions.containerHeightPx = this.itemMinHeightPx * maxDisplayedRows;
      this.dimensions.rows = this.rows;
    }

    this.dimensions.itemsPerPage = this.dimensions.itemsPerRow * this.dimensions.rows;

    if (this.stretchX) {
      this.dimensions.itemWidthPx = this.dimensions.containerWidthPx / this.dimensions.itemsPerRow;
    } else {
      this.dimensions.itemWidthPx = this.itemMinWidthPx;
    }

    if (this.XtoY) {
      // todo we can calculate sizes here more carefully
      const maxHeight = this.dimensions.containerHeightPx / this.dimensions.rows;
      this.dimensions.itemHeightPx = Math.min(this.dimensions.itemWidthPx / this.XtoY, maxHeight);
    } else if (this.stretchY) {
      this.dimensions.itemHeightPx = this.dimensions.containerHeightPx / this.dimensions.rows;
    } else {
      this.dimensions.itemHeightPx = this.itemMinHeightPx;
    }

    this.defineTotalPages();
  }

  /** count total pages. Moved out from defineDimensions 'cause it is re-calculated on items property update */
  defineTotalPages() {
    this.dimensions.pages = Math.ceil(this.totalItems / this.dimensions.itemsPerPage);
    this.dimensions = { ...this.dimensions };
  }

  /** define array of items on current page */
  async defineDisplayedItems() {
    const offset = this.state.currentPage * this.dimensions.itemsPerPage;
    const items = this.getItemsForInterval
      ? await this.getItemsForInterval(this.items, offset, this.dimensions.itemsPerPage)
      : this.items.slice(offset, offset + this.dimensions.itemsPerPage);

    if (items.length < this.dimensions.itemsPerPage && offset + items.length < this.totalItems) {
      this.state.displayedItems = [];
      this.state.pageLoaded = false;
    } else {
      this.state.displayedItems = items;
      this.state.pageLoaded = true;
    }

    this.state = { ...this.state };
  }

  /** move to page */
  selectPage(page: number) {
    if (this.state.currentPage !== page) {
      this.state.pageLoaded = false;
      this.state.currentPage = page;
      this.state.currentItem = this.state.currentPage * this.dimensions.itemsPerPage;
      this.state = { ...this.state };
      return this.defineDisplayedItems();
    }
  }

  render() {
    return (
      <Host>
        <div class="ftb-pagination__items-wrapper">
          <div
            class="ftb-pagination__items-background"
            style={{
              height: this.dimensions.containerHeightPx + 'px',
              width: this.dimensions.containerWidthPx + 'px',
            }}
          >
            {this.state.pageLoaded ? this.renderCurrentPage() : this.renderSpinner()}
          </div>
        </div>
        <div class={{ 'ftb-pagination__pages-wrapper': true, 'empty': this.dimensions.pages <= 1 }}>
          <div class="button-wrapper">{this.state.currentPage > 0 && this.renderPrevButton()}</div>
          <div class="pages">{this.renderPages()}</div>
          <div class="button-wrapper">
            {this.state.currentPage < this.dimensions.pages - 1 && this.renderNextButton()}
          </div>
        </div>
      </Host>
    );
  }

  private renderCurrentPage() {
    return this.state.displayedItems.map(i => (
      <div
        class="item"
        style={{
          width: this.dimensions.itemWidthPx + 'px',
          height: this.dimensions.itemHeightPx + 'px',
        }}
      >
        {this.renderItem(i)}
      </div>
    ));
  }

  private renderSpinner() {
    return (
      <div class="spinner-container">
        <ftb-spinner></ftb-spinner>
      </div>
    );
  }

  private renderPages() {
    const getDisplayedPages = (): Array<number | null> => {
      const displayedPages = [0];
      if (this.state.currentPage === 0) {
        if (this.dimensions.pages > 2) displayedPages.push(1);
        if (this.dimensions.pages > 3) displayedPages.push(2);
      } else if (this.state.currentPage === this.dimensions.pages - 1) {
        if (this.dimensions.pages > 3) displayedPages.push(this.dimensions.pages - 3);
        if (this.dimensions.pages > 2) displayedPages.push(this.dimensions.pages - 2);
      } else {
        [this.state.currentPage - 1, this.state.currentPage, this.state.currentPage + 1].forEach(p => {
          if (p > 0 && p < this.dimensions.pages - 1) displayedPages.push(p);
        });
      }
      displayedPages.push(this.dimensions.pages - 1);

      const displayedEntities = [];
      for (let i = 0; i < displayedPages.length; i++) {
        displayedEntities.push(displayedPages[i]);
        if (displayedPages[i + 1] - displayedPages[i] > 1) {
          displayedEntities.push(null);
        }
      }
      return displayedEntities;
    };

    return getDisplayedPages().map(p =>
      p === null ? (
        <div>...</div>
      ) : (
        <button class={{ page: true, selected: this.state.currentPage === p }} onClick={() => this.selectPage(p)}>
          {p + 1}
        </button>
      ),
    );
  }

  private renderPrevButton() {
    return (
      <button class="nav-button prev" onClick={() => this.selectPage(this.state.currentPage - 1)}>
        <ftb-icon svg={Chevron} class="chevron-icon prev"></ftb-icon>
        {translations.navigation.prev[userState.language]}
      </button>
    );
  }

  private renderNextButton() {
    return (
      <button class="nav-button next" onClick={() => this.selectPage(this.state.currentPage + 1)}>
        {translations.navigation.next[userState.language]}
        <ftb-icon svg={Chevron} class="chevron-icon next"></ftb-icon>
      </button>
    );
  }
}
