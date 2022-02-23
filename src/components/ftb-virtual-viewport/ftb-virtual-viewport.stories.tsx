import { Component, Host, h, State, Element } from '@stencil/core';
import range from 'lodash-es/range';
import { Player } from 'ftb-models';

@Component({
  tag: 'ftb-virtual-viewport-stories',
  styleUrl: 'ftb-virtual-viewport.stories.scss',
  shadow: false,
})
export class FtbVirtualViewportStories {
  @State() sortable: boolean;
  @Element() el: HTMLElement;

  render() {
    return (
      <Host>
        <h1>Virtual viewport</h1>
        <p>
          Ftb-virtual-scroll isn't convenient on mobile layouts: placing scrollable element inside scrollable content is
          a bad idea. For this case we've created ftb-virtual-viewport - rendered elements set is defined by container
          position in the viewport.
        </p>

        <ftb-code-snippet
          code="<ftb-virtual-viewport
    items={range(3000, 53000)}
    itemHeightPx={50}
    renderItem={item => ...}
    scrollableElement={element}
  />"
        />

        <ftb-virtual-viewport
          items={range(3000, 53000)}
          itemHeightPx={50}
          scrollableElement={this.el.parentElement}
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
