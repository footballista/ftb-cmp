import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'ftb-pagination-stories',
  styleUrl: 'ftb-pagination.stories.scss',
  shadow: false,
})
export class FtbPaginationStories {
  render() {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    const renderItem = idx => <div class="row">item #{idx}</div>;

    const filterFn = (items, query) => items.filter(i => (i + '').includes(query.trim()));

    return (
      <Host>
        <h1>Pagination</h1>
        <p>Renders items, divided by pages</p>

        <div class="pagination-wrapper">
          <ftb-pagination
            totalItems={items.length}
            itemsPerPage={3}
            renderPage={(o, l) => items.slice(o, l).map(renderItem)}
          />
        </div>

        <ftb-code-snippet code=" <ftb-pagination totalItems={items} itemsPerPage={3} renderPage={renderFn} />" />

        <h2>Using with ftb-searchable-content</h2>
        <p>You can make searchable content paginated</p>
        <div class="pagination-wrapper">
          <ftb-searchable-content
            items={items}
            filterFn={filterFn}
            placeholder={'Search by number'}
            renderItems={its => (
              <ftb-pagination
                totalItems={its.length}
                itemsPerPage={3}
                renderPage={(o, l) => its.slice(o, l).map(renderItem)}
              />
            )}
          />
        </div>
        <ftb-code-snippet
          code={`<ftb-searchable-content
  items={items}
  filterFn={filterFn}
  placeholder={'Search by number'}
  renderItems={its => <ftb-pagination ... />}
/>`}
        />
      </Host>
    );
  }
}
