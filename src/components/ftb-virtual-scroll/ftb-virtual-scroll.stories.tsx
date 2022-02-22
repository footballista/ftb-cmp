import { Component, Host, h, State } from '@stencil/core';
import range from 'lodash-es/range';
import { Player } from 'ftb-models';

@Component({
  tag: 'ftb-virtual-scroll-stories',
  styleUrl: 'ftb-virtual-scroll.stories.scss',
  shadow: false,
})
export class FtbVirtualScrollStories {
  @State() sortable: boolean;

  render() {
    return (
      <Host>
        <h1>Virtual scroll</h1>
        <p>Is helpful when you need to display long list of items. Renders only items in viewport.</p>

        <ftb-virtual-scroll
          items={range(3000, 53000)}
          itemHeightPx={50}
          renderItem={i => (
            <div class="item">
              <ftb-player-photo player={new Player({ _id: i })} key={i} />
              {i}
            </div>
          )}
        />

        <ftb-code-snippet
          code="<ftb-virtual-scroll
    items={range(3000, 53000)}
    itemHeightPx={50}
    renderItem={item => ...}
  />"
        />

        <h2>Sortable</h2>
        <p>
          You can add drag-n-drop sorting by passing{' '}
          <pre class="inline-code">
            <code>sortable</code>
          </pre>{' '}
          parameter
        </p>
        <ftb-code-snippet
          code="<ftb-virtual-scroll
  sortable={true}
  items={range(3000, 53000)}
  itemHeightPx={50}
  renderItem={item => ...}
/>"
        />
        <div class="button-container">
          <button onClick={() => (this.sortable = !this.sortable)} class="sortable-button">
            {this.sortable ? 'Disable' : 'Enable'} sortable
          </button>
        </div>
        <ftb-virtual-scroll
          sortable={this.sortable}
          items={range(3000, 53000)}
          itemHeightPx={50}
          renderItem={i => (
            <div class="item">
              <ftb-player-photo player={new Player({ _id: i })} key={i} />
              {i}
            </div>
          )}
        />
      </Host>
    );
  }
}
