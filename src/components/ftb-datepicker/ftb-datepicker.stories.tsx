import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'ftb-datepicker-stories',
  styleUrl: 'ftb-datepicker.stories.scss',
  shadow: false,
})
export class FtbStageCupNetStories {
  render() {
    return (
      <Host>
        <ftb-datepicker onDateSelected={e => console.log(e)} />
      </Host>
    );
  }
}
