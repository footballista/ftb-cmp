import { Component, Host, h, Prop, Element, State } from '@stencil/core';
import { checkElementSize } from 'ftb-models';
import { AsyncSubject, Subject, timer } from 'rxjs';
import { debounce, distinctUntilChanged, takeUntil, map } from 'rxjs/operators';

@Component({
  tag: 'ftb-virtual-scroll',
  styleUrl: 'ftb-virtual-scroll.component.scss',
  shadow: false,
})
export class FtbVirtualScroll {
  @Prop() totalItems!: number;
  @Prop() itemHeightPx!: number;
  @Prop() renderRange!: (from: number, to: number) => string;
  @State() range: { from: number; to: number };
  containerHeight: number;
  itemsPerViewport: number;
  scrolled$ = new Subject();
  onDestroyed$ = new AsyncSubject();

  @Element() el: HTMLElement;

  async componentDidLoad() {
    this.containerHeight = (await checkElementSize(this.el)).height;
    this.itemsPerViewport = Math.ceil(this.containerHeight / this.itemHeightPx);

    this.el.onscroll = () => this.scrolled$.next(true);
    this.scrolled$
      .pipe(
        takeUntil(this.onDestroyed$),
        debounce(() => timer(100)),
        map(() => this.el.scrollTop),
        distinctUntilChanged(),
      )
      .subscribe(top => {
        this.calculateRange(top);
      });
    this.calculateRange(0);
  }

  disconnectedCallback() {
    this.onDestroyed$.next(true);
    this.onDestroyed$.complete();
  }

  calculateRange(scrollTop: number) {
    const additionalItemsBuffer = 5; // rendering 5 more items before and after viewport to reduce glitch on scroll start
    const startItemIdx = Math.floor(scrollTop / this.itemHeightPx);
    this.range = {
      from: Math.max(0, startItemIdx - additionalItemsBuffer),
      to: Math.min(this.totalItems, startItemIdx + this.itemsPerViewport + additionalItemsBuffer),
    };
    console.log(this.range);
  }

  render() {
    return (
      <Host>
        <div class="ftb-virtual-scroll__content" style={{ height: this.totalItems * this.itemHeightPx + 'px' }}>
          {Boolean(this.range) && (
            <div class="range" style={{ transform: `translateY(${this.range.from * this.itemHeightPx}px)` }}>
              {this.renderRange(this.range.from, this.range.to)}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
