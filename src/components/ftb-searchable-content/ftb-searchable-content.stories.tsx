import { Component, h, Host } from '@stencil/core';
import { filter } from 'ftb-models';
import uniq from 'lodash-es/uniq';

@Component({
  tag: 'ftb-searchable-content-stories',
  styleUrl: 'ftb-searchable-content.stories.scss',
  shadow: false,
})
export class FtbPlayerPhotoStories {
  items = [
    { mark: 'Volkswagen', model: 'Golf', color: 'cornflowerblue' },
    { mark: 'Volkswagen', model: 'Tuareg', color: 'black' },
    { mark: 'Volkswagen', model: 'Beetle', color: 'yellow' },
    { mark: 'Audi', model: 'A3', color: 'cornflowerblue' },
    { mark: 'Audi', model: 'Q5', color: 'black' },
  ];

  render() {
    const filterFn = async (items, query, categories) => {
      const color = categories.find(c => c.key === 'color')?.options.find(o => o.selected)?.key;
      if (color && color !== 'all') {
        items = items.filter(i => i.color == color);
      }
      return filter(items, query, ['mark', 'model']);
    };

    return (
      <Host>
        <h1>Searchable content</h1>
        <p>Renders content that can be searched and categorized</p>
        <ftb-searchable-content
          items={this.items}
          filterFn={filterFn}
          placeholder="Search by mark or model"
          renderItems={i => this.renderItems(i)}
        />
        <ftb-code-snippet
          code={`
<ftb-searchable-content
  items={...}
  filterFn={filterFn}
  placeholder="Search by mark or model"
  renderItems={renderFn}
/>
        `}
        />

        <h2>Filters</h2>
        <p>Add categories to create additional filter ability</p>
        <ftb-searchable-content
          items={this.items}
          filterFn={filterFn}
          placeholder="Search by mark or model"
          renderItems={i => this.renderItems(i)}
          categories={[
            {
              key: 'color',
              placeholder: 'Search',
              filterFn: (query, options) => filter(options, query, ['text']),
              renderItem: i => (
                <span>
                  {i.text} {i.color && <div class="color" style={{ 'background-color': i.color }} />}
                </span>
              ),
              options: [
                { key: 'all', text: 'All colors' },
                ...uniq(this.items.map(car => car.color)).map(color => ({ key: color, text: color, color })),
              ],
            },
          ]}
        />
        <ftb-code-snippet
          code={`
<ftb-searchable-content
  items={...}
  filterFn={filterFn}
  placeholder="Search by mark or model"
  renderItems={renderFn}
  categories={...}
/>
        `}
        />
        <p>inspect stories component code to understand how to work with filters and categories</p>

        <h2>Debounce</h2>
        <p>
          If content loading/rendering is a heavy operation (e.g. performing service call at every change), you can
          increase input debounce value
        </p>
        <ftb-searchable-content
          items={this.items}
          filterFn={filterFn}
          placeholder="Search by mark or model"
          renderItems={i => this.renderItems(i)}
          debounce={1000}
        />
        <ftb-code-snippet code={`<ftb-searchable-content ...  debounce={1000} />`} />
      </Host>
    );
  }

  renderItems(items) {
    return items.map(i => (
      <div class="row">
        {i.mark} {i.model} <div class="color" style={{ background: i.color }} />
      </div>
    ));
  }
}
