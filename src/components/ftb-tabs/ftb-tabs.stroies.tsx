import { Component, Host, h, State } from '@stencil/core';

@Component({
  tag: 'ftb-tabs-stories',
  styleUrl: 'ftb-tabs.stories.scss',
  shadow: false,
})
export class FtbTabsStroies {
  @State() tabs = [
    {
      key: 'oop',
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
      key: 'rainbow',
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

  @State() second = [
    {
      key: 'ftb',
      title: () => 'Ftb',
      body: () => (
        <ul>
          <li>Website</li>
          <li>Mobile App</li>
          <li>Admin panel</li>
          <li>Infographics</li>
          <li>API</li>
          <li>Web components</li>

          <a href={'#second:nested'}>switch to tab with nested tabs</a>
        </ul>
      ),
    },
    {
      key: 'nested',
      title: () => 'Nested',
      body: () => [
        <p>
          You can place tabs inside tabs. Using <i>navKey</i> parameter for all tabs is mandatory
        </p>,
        <ftb-tabs
          navKey={'nested'}
          tabs={[
            {
              key: 'first-nested',
              title: () => 'First',
              body: () => 'First nested tab',
            },
            {
              key: 'second-nested',
              title: () => 'Second',
              body: () => 'Second nested tab',
            },
          ]}
        />,
      ],
    },
  ];

  render() {
    return (
      <Host>
        <h1>Tabs</h1>
        <p>Organizes content into tabs. Uses hash navigation, so active tab could be passed by url.</p>

        <ftb-tabs tabs={this.tabs} navKey="demo" />

        <button
          class="add-tab-button"
          onClick={() =>
            (this.tabs = [
              {
                key: 'dynamic' + this.tabs.length,
                title: () => 'Added tab',
                body: () => <ul>Hi, I was added dynamically</ul>,
              },
              ...this.tabs,
            ])
          }
        >
          Add tab
        </button>

        <ftb-code-snippet code={'<ftb-tabs tabs={this.tabs}/>'} />

        <h2>Multiple components</h2>
        <p>
          Add
          <pre class="inline-code">
            <code>navKey</code>
          </pre>{' '}
          parameter to use hash navigation for multiple tabs on one page.
        </p>

        <ftb-tabs tabs={this.second} navKey="second" />

        <ftb-code-snippet code={'<ftb-tabs tabs={this.tabs} navKey="second"/>'} />
      </Host>
    );
  }
}
