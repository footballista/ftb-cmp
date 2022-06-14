import { Component, Host, h, Event, EventEmitter, State, Prop } from '@stencil/core';
import { DatepickerIntervalInterface } from '@src/components/ftb-datepicker/ftb-datepicker-interval.interface';
import dayjs from 'dayjs';
import range from 'lodash-es/range';
import localeData from 'dayjs/plugin/localeData';
import { translations, userState } from 'ftb-models';
dayjs.extend(localeData);

@Component({
  tag: 'ftb-datepicker',
  styleUrl: 'ftb-datepicker.component.scss',
  shadow: false,
})
export class FtbDatepicker {
  @Prop({ mutable: true }) from;
  @Prop({ mutable: true }) to;
  @Event() dateSelected: EventEmitter<DatepickerIntervalInterface>;
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

    console.log(date);
  }

  render() {
    const firstDay = dayjs(this.year + '-' + this.month + '-01');

    return (
      <Host>
        <div class="calendar">
          <div class="month-row">
            <button onClick={() => this.prevMonth()}>prev</button>
            {firstDay.format('MMMM')}
            <button onClick={() => this.nextMonth()}>next</button>
          </div>
          <div class="days-row">
            {dayjs.weekdaysMin().map(day => {
              return <div class="day-name">{day}</div>;
            })}
          </div>
          <div class="slots">
            {range(firstDay.day()).map(() => (
              <div class="slot empty" />
            ))}
            {range(firstDay.daysInMonth()).map(idx => (
              <button class="slot" onClick={() => this.onSlotClick(idx)}>
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => this.dateSelected.emit({ from: this.from, to: this.to })} class="submit-button">
          {translations.navigation.done[userState.language]}
        </button>
      </Host>
    );
  }
}
