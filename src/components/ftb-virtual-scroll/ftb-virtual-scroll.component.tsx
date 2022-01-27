import { Component, h, Host, Prop, Element, writeTask } from '@stencil/core';
import { checkElementSize } from 'ftb-models';

@Component({
  tag: 'ftb-virtual-scroll',
  styleUrl: 'ftb-virtual-scroll.component.scss',
  shadow: false,
})
export class FtbVirtualScroll {
  @Prop() items!: any[];
  @Prop() itemHeightPx!: number;
  @Prop() renderItem!: (item: any) => string;
  itemsPerViewport: number;

  @Element() el: HTMLElement;
  elements: { [position: number]: HTMLElement } = {};

  constructor() {
    this.onScroll = this.onScroll.bind(this);
  }

  async componentDidLoad() {
    const { height: containerHeight } = await checkElementSize(this.el);
    this.itemsPerViewport = Math.ceil(containerHeight / this.itemHeightPx);
    this.renderRange(0);
    this.el.addEventListener('scroll', this.onScroll);
  }

  onScroll() {
    writeTask(() => this.renderRange(this.el.scrollTop));
  }

  disconnectedCallback() {
    this.el.removeEventListener('scroll', this.onScroll);
  }

  renderRange(scrollTop: number) {
    const additionalItemsBuffer = 2; // rendering 2 more items before and after viewport to reduce glitch on scroll start
    const startItemIdx = Math.floor(scrollTop / this.itemHeightPx);
    const range = {
      from: Math.max(0, startItemIdx - additionalItemsBuffer),
      to: Math.min(this.items.length, startItemIdx + this.itemsPerViewport + additionalItemsBuffer),
    };
    for (const position in this.elements) {
      if (parseInt(position) < range.from || parseInt(position) > range.to) {
        this.elements[position].remove();
        delete this.elements[position];
      }
    }

    for (let position = range.from; position <= range.to; position++) {
      this.elements[position] ??= (() => {
        const item = document.createElement('ftb-virtual-scroll-item');
        Object.assign(item, { item: this.items[position], renderItem: this.renderItem });
        item.style.transform = `translateY(${position * this.itemHeightPx}px)`;
        this.el.childNodes[0].appendChild(item);
        return item;
      })();
    }
  }

  render() {
    return (
      <Host>
        <div class="ftb-virtual-scroll__content" style={{ height: this.items.length * this.itemHeightPx + 'px' }}></div>
      </Host>
    );
  }
}
