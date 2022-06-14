import { Component, Host, h, Event, EventEmitter, State, Prop } from '@stencil/core';
import dayjs from 'dayjs';
import range from 'lodash-es/range';
import ArrowIcon from '../../assets/icons/arrow.svg';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/ru';
dayjs.extend(localeData);
dayjs.extend(weekday);

dayjs.locale('ru');
dayjs().weekday(-5);

@Component({
  tag: 'ftb-datepicker',
  styleUrl: 'ftb-datepicker.component.scss',
  shadow: false,
})
export class FtbDatepicker {
  @Prop({ mutable: true }) from;
  @Prop({ mutable: true }) to;
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

    if (!this.from) {
      this.from = date;
    } else {
      this.to = date;
    }
    if (this.to < this.from) {
      [this.to, this.from] = [this.from, this.to];
    }

    if (this.to && this.from) {
      this.dateSelected.emit({ from: this.from, to: this.to });
    }
  }

  render() {
    const firstDay = dayjs(this.year + '-' + this.month + '-01');

    return (
      <Host>
        <div class="calendar">
          <div class="month-row">
            <button class="prev-btn" onClick={() => this.prevMonth()}>
              <ftb-icon svg={ArrowIcon} />
            </button>
            {firstDay.format('MMMM')}
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
            {range(firstDay.day()).map(() => (
              <div class="slot empty" />
            ))}
            {range(firstDay.daysInMonth()).map(idx => {
              const day = dayjs(this.year + '-' + this.month + '-' + (idx + 1));
              return (
                <button
                  class={{
                    'slot': true,
                    'active-from': this.from?.isSame(day),
                    'active-to': this.to?.isSame(day),
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
