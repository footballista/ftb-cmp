import { Component, Host, h } from '@stencil/core';
import range from 'lodash-es/range';
import { Player } from 'ftb-models';

@Component({
  tag: 'ftb-virtual-scroll-stories',
  styleUrl: 'ftb-virtual-scroll.stories.scss',
  shadow: false,
})
export class FtbVirtualScrollStories {
  items = range(3000, 53000);

  render() {
    return (
      <Host>
        <h1>Virtual scroll</h1>
        <p>Is helpful when you need to display long list of items. Renders only items in viewport.</p>

        <ftb-virtual-scroll
          totalItems={50000}
          itemHeightPx={50}
          renderRange={(from, to) => this.renderRange(from, to)}
        />

        <ftb-code-snippet
          code="<ftb-virtual-scroll
  totalItems={50000}
  itemHeightPx={50}
  renderRange={(from, to) => this.renderRange(from, to)}
/>"
        />
      </Host>
    );
  }

  renderRange(from: number, to: number) {
    const items = this.items.slice(from, to);
    return items.map(i => (
      <div class="item">
        <ftb-player-photo player={new Player({ _id: i })} key={i} />
        {i}
      </div>
    ));
  }
}
