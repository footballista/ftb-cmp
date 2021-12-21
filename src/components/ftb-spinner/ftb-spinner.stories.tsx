import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'ftb-spinner-stories',
  styleUrl: 'ftb-spinner.stories.scss',
  shadow: false,
})
export class FtbSpinnerStories {
  render() {
    return (
      <Host>
        <h1>Spinner</h1>
        <ftb-spinner />
        <p>Simple bounce loader</p>
        <ftb-code-snippet code="<ftb-spinner/>" />
        <p>Size and color are set via css variables</p>
        <ftb-code-snippet code="ftb-spinner { --size: 10px; --color: #6495ed }" language="css" />
      </Host>
    );
  }
}
