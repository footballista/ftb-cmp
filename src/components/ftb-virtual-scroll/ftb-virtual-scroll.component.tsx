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
  @Prop() items!: any[];
  @Prop() itemHeightPx!: number;
  @Prop() renderItem!: (item: any) => string;
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
        debounce(() => timer(50)),
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
      to: Math.min(this.items.length, startItemIdx + this.itemsPerViewport + additionalItemsBuffer),
    };
  }

  render() {
    return (
      <Host>
        <div class="ftb-virtual-scroll__content" style={{ height: this.items.length * this.itemHeightPx + 'px' }}>
          {Boolean(this.range) && (
            <div
              class="ftb-virtual-scroll__range"
              style={{ transform: `translateY(${this.range.from * this.itemHeightPx}px)` }}
            >
              {this.items.slice(this.range.from, this.range.to).map(i => this.renderItem(i))}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
