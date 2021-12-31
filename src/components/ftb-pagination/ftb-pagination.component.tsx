import { Component, Host, h, Prop, State } from '@stencil/core';
import Chevron from '../../assets/icons/chevron-down.svg';
import { translations, userState } from 'ftb-models';
import { checkElementSize } from '@src/tools/check-element-size';

@Component({
  tag: 'ftb-pagination',
  styleUrl: 'ftb-pagination.component.scss',
  shadow: false,
})
export class FtbPagination {
  /** total items */
  @Prop() totalItems!: number;

  /** number of items per each page */
  @Prop() itemsPerPage!: number;

  /** render function for items chunk */
  @Prop() renderPage!: (fromIdx, toIdx) => string | string[];

  @State() currentPage: number = 0;

  setMinHeight(el: HTMLDivElement) {
    checkElementSize(el).then(({ height }) => {
      el.style['min-height'] = height + 'px';
    });
  }

  render() {
    if (this.totalItems == undefined) return null;

    if (this.totalItems < 0) throw new Error('Incorrect "totalItems" value. Should be positive number');
    if (this.itemsPerPage < 1) throw new Error('Incorrect "itemsPerPage" value. Should be positive number');

    return (
      <Host>
        <div class="ftb-pagination__items-container" ref={el => this.setMinHeight(el)}>
          {this.renderPage(this.currentPage * this.itemsPerPage, (this.currentPage + 1) * this.itemsPerPage)}
        </div>
        <div class="ftb-pagination__nav-line">
          {this.renderPrevButton()}
          <div class="ftb-pagination__nav-pages-buttons">{this.renderPageNumbers()}</div>
          {this.renderNextButton()}
        </div>
      </Host>
    );
  }

  renderPrevButton() {
    return (
      <button
        class="ftb-pagination__nav-button ftb-pagination__prev-button"
        onClick={() => this.currentPage--}
        disabled={this.currentPage == 0}
      >
        <ftb-icon svg={Chevron} class="ftb-pagination__chevron-icon" />
        <span class="ftb-pagination__nav-button-text">{translations.navigation.prev[userState.language]}</span>
      </button>
    );
  }

  renderNextButton() {
    return (
      <button
        class="ftb-pagination__nav-button ftb-pagination__next-button"
        onClick={() => this.currentPage++}
        disabled={this.currentPage > this.totalItems / this.itemsPerPage - 1}
      >
        <ftb-icon svg={Chevron} class="ftb-pagination__chevron-icon" />
        <span class="ftb-pagination__nav-button-text">{translations.navigation.next[userState.language]}</span>
      </button>
    );
  }

  private renderPageNumbers() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    const getDisplayedPages = (): Array<number | null> => {
      const displayedPages = [0];
      if (this.currentPage === 0) {
        if (totalPages > 2) displayedPages.push(1);
        if (totalPages > 3) displayedPages.push(2);
      } else if (this.currentPage === totalPages - 1) {
        if (totalPages > 3) displayedPages.push(totalPages - 3);
        if (totalPages > 2) displayedPages.push(totalPages - 2);
      } else {
        [this.currentPage - 1, this.currentPage, this.currentPage + 1].forEach(p => {
          if (p > 0 && p < totalPages - 1) displayedPages.push(p);
        });
      }
      if (totalPages > 1) displayedPages.push(totalPages - 1);

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
        <button class={{ page: true, selected: this.currentPage === p }} onClick={() => (this.currentPage = p)}>
          {p + 1}
        </button>
      ),
    );
  }
}
