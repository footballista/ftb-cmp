import { Component, h, Host, State } from '@stencil/core';

@Component({
  tag: 'ftb-datepicker-stories',
  styleUrl: 'ftb-datepicker.stories.scss',
  shadow: false,
})
export class FtbStageCupNetStories {
  @State() from;
  @State() to;
  render() {
    return (
      <Host>
        <ftb-datepicker
          onDateSelected={e => {
            this.from = e.detail.from;
            this.to = e.detail.to;
          }}
          from={this.from}
          to={this.to}
        />
        <div class="selected">
          <div>
            <b>FROM:</b> <span>{this.from?.format('DD MMM YYYY') || '--'}</span>
            {this.from && <button onClick={() => (this.from = null)}>X</button>}
          </div>
          <div>
            <b>TO:</b>
            <span>{this.to?.format('DD MMM YYYY') || '--'}</span>
            {this.to && <button onClick={() => (this.to = null)}>X</button>}
          </div>
        </div>
      </Host>
    );
  }
}
