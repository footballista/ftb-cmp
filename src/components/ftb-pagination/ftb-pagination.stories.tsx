import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'ftb-pagination-stories',
  styleUrl: 'ftb-pagination.stories.scss',
  shadow: false,
})
export class FtbPaginationStories {
  render() {
    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
      <Host>
        <h1>Pagination</h1>
        <p>Renders items, divided by pages</p>

        <ftb-pagination
          totalItems={10}
          itemsPerPage={3}
          renderPage={(o, l) => items.slice(o, l).map(idx => <div class="row">{idx}</div>)}
        />
      </Host>
    );
  }
}
