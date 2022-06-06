import { Component, h, Host, Element } from '@stencil/core';
import range from 'lodash-es/range';
import { Player } from 'ftb-models';

@Component({
  tag: 'ftb-collapsible-tabs-stories',
  styleUrl: 'ftb-collapsible-tabs.stories.scss',
  shadow: false,
})
export class FtbCollapsibleTabsStories {
  @Element() el;

  renderRandomList() {
    return range(30).map(i => (
      <div class="row">
        {i} - {Math.round(Math.random() * 10)}
      </div>
    ));
  }

  renderVirtualScrollList() {
    return (
      <ftb-virtual-scroll
        items={range(30000, 50000)}
        itemHeightPx={40}
        renderItem={i => (
          <div class="item">
            <ftb-player-photo player={new Player({ _id: i })} key={i} /> virtual scroll
          </div>
        )}
      />
    );
  }

  renderVirtualViewportList() {
    // const tabs = Array.from(this.el.querySelectorAll('ftb-collapsible-tabs .ftb-c-tabs__body-tab'));

    return (
      <ftb-virtual-viewport
        items={range(30000, 50000)}
        itemHeightPx={40}
        scrollableElement={() =>
          this.el.querySelectorAll(
            'ftb-collapsible-tabs .ftb-c-tabs__body > .swiper-wrapper > .ftb-c-tabs__body-tab',
          )[2]
        }
        renderItem={i => (
          <div class="item">
            <ftb-player-photo player={new Player({ _id: i })} key={i} /> virtual viewport
          </div>
        )}
      />
    );
  }

  render() {
    const tabs = [
      { key: 'first', title: () => 'First', body: () => this.renderRandomList() },
      { key: 'second', title: () => 'Vs', body: () => this.renderVirtualScrollList() },
      { key: 'third', title: () => 'Vw', body: () => this.renderVirtualViewportList() },
      { key: 'fourth', title: () => 'Fourth', body: () => this.renderRandomList() },
      { key: 'fifth', title: () => 'Fifth', body: () => this.renderRandomList() },
      { key: 'sixth', title: () => 'Sixth', body: () => this.renderRandomList() },
      { key: 'seventh', title: () => 'Seventh', body: () => this.renderRandomList() },
      { key: 'eight', title: () => 'Eighth', body: () => this.renderRandomList() },
    ];

    return (
      <Host>
        <h1>Collapsible tabs</h1>
        Collapsible content is used in mobile layouts. Navigation between tabs is implemented with swiper slides.
        <ftb-collapsible-tabs renderHeader={() => <div class="header-panel">HEADER TO BE COLLAPSED</div>} tabs={tabs} />
      </Host>
    );
  }
}
