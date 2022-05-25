import { Component, h, Host } from '@stencil/core';
import range from 'lodash-es/range';

@Component({
  tag: 'ftb-collapsible-tabs-stories',
  styleUrl: 'ftb-collapsible-tabs.stories.scss',
  shadow: false,
})
export class FtbCollapsibleTabsStories {
  renderRandomList() {
    return range(30).map(i => (
      <div class="row">
        {i} - {Math.round(Math.random() * 10)}
      </div>
    ));
  }

  render() {
    const tabs = [
      { key: 'first', title: () => 'First', body: () => this.renderRandomList() },
      { key: 'second', title: () => 'Second', body: () => this.renderRandomList() },
      { key: 'third', title: () => 'Third', body: () => this.renderRandomList() },
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
