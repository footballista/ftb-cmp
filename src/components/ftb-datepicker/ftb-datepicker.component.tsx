import { Component, Host, h, Event, EventEmitter, State, Prop } from '@stencil/core';
import dayjs from 'dayjs';
import range from 'lodash-es/range';
import ArrowIcon from '../../assets/icons/arrow.svg';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import { translations, userState } from 'ftb-models';
dayjs.extend(localeData);
dayjs.extend(weekday);

@Component({
  tag: 'ftb-datepicker',
  styleUrl: 'ftb-datepicker.component.scss',
  shadow: false,
})
export class FtbDatepicker {
  @Prop({ mutable: true }) from;
  @Prop({ mutable: true }) to;
  @Prop({ mutable: true }) currentField: 'from' | 'to' = 'from';
  @Event() dateSelected: EventEmitter;
  @State() month: number = dayjs().month() + 1;
  @State() year: number = dayjs().year();

  nextMonth() {
    if (this.month < 11) {
      this.month++;
    } else {
      this.year++;
      this.month = 0;
    }
  }

  prevMonth() {
    if (this.month > 0) {
      this.month--;
    } else {
      this.year--;
      this.month = 11;
    }
  }

  onSlotClick(idx) {
    const date = dayjs(this.year + '-' + this.month + '-' + (idx + 1));

    if (this.currentField == 'from') {
      this.from = date;
    } else {
      this.to = date;
    }
    if (this.to < this.from) {
      [this.to, this.from] = [this.from, this.to];
    }

    if (this.to && this.from) {
      this.dateSelected.emit({ from: this.from, to: this.to });
    } else if (!this.to) {
      this.currentField = 'to';
    } else if (!this.from) {
      this.currentField = 'from';
    }
  }

  render() {
    const firstDay = dayjs(this.year + '-' + this.month + '-01');

    return (
      <Host>
        <div class="calendar">
          <div class="button-group">
            <div
              class={{ 'button': true, 'button-from': true, 'active': this.currentField == 'from' }}
              onClick={() => (this.currentField = 'from')}
            >
              <p class="title">{translations.calendar.from[userState.language]}</p>
              <p class="date">{this.from?.format('DD MMM YYYY') || '--'}</p>
            </div>
            <div
              class={{ 'button': true, 'button-to': true, 'active': this.currentField == 'to' }}
              onClick={() => (this.currentField = 'to')}
            >
              <p class="title">{translations.calendar.to[userState.language]}</p>
              <p class="date">{this.to?.format('DD MMM YYYY') || '--'}</p>
            </div>
          </div>
          <div class="month-row">
            <button class="prev-btn" onClick={() => this.prevMonth()}>
              <ftb-icon svg={ArrowIcon} />
            </button>
            {firstDay.format('MMMM YYYY')}
            <button class="next-btn" onClick={() => this.nextMonth()}>
              <ftb-icon svg={ArrowIcon} />
            </button>
          </div>
          <div class="days-row">
            {dayjs.weekdaysMin(true).map(day => {
              return <div class="day-name">{day}</div>;
            })}
          </div>
          <div class="slots">
            {range(firstDay.weekday()).map(() => (
              <div class="slot empty" />
            ))}
            {range(firstDay.daysInMonth()).map(idx => {
              const day = dayjs(this.year + '-' + this.month + '-' + (idx + 1));
              return (
                <button
                  class={{
                    'slot': true,
                    'active-from': this.from?.isSame(day, 'day'),
                    'active-to': this.to?.isSame(day, 'day'),
                    'active-between': this.from && this.to && day > this.from && day < this.to,
                  }}
                  onClick={() => this.onSlotClick(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </Host>
    );
  }
}
