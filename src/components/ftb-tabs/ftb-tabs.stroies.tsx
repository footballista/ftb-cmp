import { Component, Host, h, State } from '@stencil/core';

@Component({
  tag: 'ftb-tabs-stories',
  styleUrl: 'ftb-tabs.stories.scss',
  shadow: false,
})
export class FtbTabsStroies {
  @State() tabs = [
    {
      title: () => 'OOP',
      body: () => (
        <ul>
          <li>polymorphism</li>
          <li>encapsulation</li>
          <li>inheritance</li>
        </ul>
      ),
    },
    {
      title: () => 'Rainbow',
      body: () => (
        <ul>
          <li>red</li>
          <li>orange</li>
          <li>yellow</li>
          <li>green</li>
          <li>blue</li>
          <li>violet</li>
        </ul>
      ),
    },
  ];

  render() {
    return (
      <Host>
        <h1>Tabs</h1>
        <p>Organizes content into tabs</p>

        <ftb-tabs tabs={this.tabs} selectedTab={this.tabs[1]} />

        <ftb-code-snippet code={'<ftb-tabs tabs={this.tabs} selectedTab={this.tabs[1]} />'} />

        <button
          class="add-tab-button"
          onClick={() =>
            (this.tabs = [{ title: () => 'Added tab', body: () => <ul>Hi, I was added dynamically</ul> }, ...this.tabs])
          }
        >
          Add tab
        </button>
      </Host>
    );
  }
}
