import { Component, h, Host } from '@stencil/core';
// import FootballistaIcon from '../../../assets/icons/footballista.svg';
// import { envState } from 'ftb-models';

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
          This is Storybook-alike documentation site for{' '}
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
