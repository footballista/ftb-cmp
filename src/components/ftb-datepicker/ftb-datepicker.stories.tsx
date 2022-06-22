import { Component, h, Host, State } from '@stencil/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

@Component({
  tag: 'ftb-datepicker-stories',
  styleUrl: 'ftb-datepicker.stories.scss',
  shadow: false,
})
export class FtbStageCupNetStories {
  @State() from;
  @State() to;
  @State() currentField: 'from' | 'to';
  @State() locale = 'ru';

  componentWillLoad() {
    dayjs.locale(this.locale);
  }

  toggleLocale() {
    if (this.locale == 'ru') {
      this.locale = 'en';
    } else {
      this.locale = 'ru';
    }
    dayjs.locale(this.locale);
  }

  render() {
    return (
      <Host>
        <h1>Datepicker</h1>
        <p>Locale-sensitive date picker to select dates interval</p>
        <ftb-datepicker
          key={this.locale}
          onDateSelected={e => {
            this.from = e.detail.from;
            this.to = e.detail.to;
          }}
          from={this.from}
          to={this.to}
          currentField={this.currentField}
        />
        <div class="selected">
          <div>
            <b>Locale:</b>
            <span>{this.locale}</span>
            <button onClick={() => this.toggleLocale()}>toggle</button>
          </div>
          <div>
            <b>FROM:</b> <span>{this.from?.format('DD MMM YYYY') || '--'}</span>
            {this.from && (
              <button
                onClick={() => (this.currentField = 'from')}
                class={{ 'active-button': this.currentField == 'from' }}
              >
                change
              </button>
            )}
            {this.from && <button onClick={() => (this.from = null)}>x</button>}
          </div>
          <div>
            <b>TO:</b>
            <span>{this.to?.format('DD MMM YYYY') || '--'}</span>
            {this.to && (
              <button onClick={() => (this.currentField = 'to')} class={{ 'active-button': this.currentField == 'to' }}>
                change
              </button>
            )}
            {this.to && <button onClick={() => (this.to = null)}>x</button>}
          </div>
        </div>
      </Host>
    );
  }
}
