import { Component, h, Host } from '@stencil/core';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'ftb-showcase-main',
  styleUrl: 'ftb-showcase-main.component.scss',
  shadow: false,
})
export class FtbShowcasePage {
  render() {
    return (
      <Host>
        {/*{envState.platform == 'web' && <ftb-icon svg={FootballistaIcon} class="main-logo" />}*/}
        <h1>Footballista web components</h1>
        <p>
          This is documentation site for{' '}
          <code>
            <a href="https://github.com/footballista/ftb-cmp" target="_blank">
              ftb-cmp
            </a>
          </code>{' '}
          repository, that contains web components for products based on{' '}
          <a href="https://demo.footballista.ru">Footballista</a> platform.
        </p>
        <p>Check out components in the menu and explore docs, use-cases and code examples.</p>
        <p>
          If you are looking for Footballista Infographics Storybook, it is located{' '}
          <a href="https://storybook.footballista.ru">here</a>
        </p>
        <h2>Changelog</h2>
        <div class="changelog-row">
          <b>3.4.0</b>
          <span class="date">01 Feb 2022</span>
          <ul>
            <li>
              Added multiple teams highlighting to <a {...href('/ftb-stage-cup-net')}>cup net</a> and{' '}
              <a {...href('/ftb-stage-table')}>stage table</a> components.
            </li>
          </ul>

          <b>3.3.1</b>
          <span class="date">27 Jan 2022</span>
          <ul>
            <li>
              Refactored <a {...href('/ftb-virtual-scroll')}>ftb virtual scroll</a> component to improve performance
            </li>
          </ul>

          <b>3.2.0</b>
          <span class="date">20 Jan 2022</span>
          <ul>
            <li>
              Created <a {...href('/ftb-cup-net-explorer')}>cup net explorer</a> component
            </li>
            <li>
              Created <a {...href('/ftb-tabs')}>tabs </a> component
            </li>
            <li>Fixed team highlighting in stage table when limit is more than table length</li>
          </ul>

          <b>3.1.0</b>
          <span class="date">14 Jan 2022</span>
          <ul>
            <li>
              Created <a {...href('/ftb-virtual-scroll')}>virtual scroll</a> component for rendering long lists
            </li>
          </ul>
          <b>3.0.1</b>
          <span class="date">30 Dec 2021</span>
          <ul>
            <li>Fixed hq images loading for video and team logo component</li>
          </ul>
          <b>3.0.0</b>
          <span class="date">28 Dec 2021</span>
          <ul>
            <li>Removed all components with fetch logic</li>
            <li>Refactored main components</li>
            <li>Documentation created</li>
          </ul>
        </div>
      </Host>
    );
  }
}
