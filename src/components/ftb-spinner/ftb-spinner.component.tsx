import { Component, Host, h } from '@stencil/core';
@Component({
  tag: 'ftb-spinner',
  styleUrl: 'ftb-spinner.component.scss',
  shadow: false,
})
export class FtbSpinner {
  render() {
    return (
      <Host>
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
      </Host>
    );
  }
}
