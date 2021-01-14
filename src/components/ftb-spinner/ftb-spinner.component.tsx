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
          <div class="bounce"></div>
          <div class="bounce"></div>
          <div class="bounce 3"></div>
        </div>
      </Host>
    );
  }
}
