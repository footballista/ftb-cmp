import { Component, h, Host, Prop, Element } from '@stencil/core';

interface ListElement {
  item: HTMLElement;
  position: number;
}

@Component({
  tag: 'ftb-virtual-viewport',
  styleUrl: 'ftb-virtual-viewport.component.scss',
  shadow: false,
})
export class FtbVirtualViewport {
  @Prop() items!: any[];
  @Prop() itemHeightPx!: number;
  /** element to listen for scroll events */
  @Prop() scrollableElement!: HTMLElement;
  @Prop() renderItem!: (item: any) => string;

  @Element() el: HTMLElement;
  elements: { [position: number]: ListElement } = {};

  constructor() {
    this.renderRange = this.renderRange.bind(this);
  }

  async componentDidLoad() {
    this.renderRange();
    this.scrollableElement.addEventListener('scroll', this.renderRange);
  }

  onParentScroll() {}

  disconnectedCallback() {
    this.scrollableElement.removeEventListener('scroll', this.renderRange);
  }

  renderRange() {
    const { top: containerTop, bottom: containerBottom } = this.scrollableElement.getBoundingClientRect();
    const { top: elTop } = this.el.getBoundingClientRect();

    const visibleHeight = containerBottom - Math.max(containerTop, elTop);
    const visibleItemsNumber = Math.ceil(visibleHeight / this.itemHeightPx);
    const topDistance = Math.max(0, containerTop - elTop);
    const startItemIdx = Math.floor(topDistance / this.itemHeightPx);
    const additionalItemsBuffer = 2; // rendering 2 more items before and after viewport to reduce glitch on scroll start
    // const startItemIdx = Math.floor(scrollTop / this.itemHeightPx);
    const range = {
      from: Math.max(0, startItemIdx - additionalItemsBuffer),
      to: Math.min(this.items.length, startItemIdx + visibleItemsNumber + additionalItemsBuffer),
    };

    for (const position in this.elements) {
      if (parseInt(position) < range.from || parseInt(position) > range.to) {
        this.elements[position].item.remove();
        delete this.elements[position];
      }
    }

    for (let position = range.from; position <= range.to; position++) {
      this.elements[position] ??= (() => {
        const item = document.createElement('ftb-virtual-viewport-item');
        Object.assign(item, { item: this.items[position], renderItem: this.renderItem });
        item.style.transform = `translateY(${position * this.itemHeightPx}px)`;
        this.el.childNodes[0].appendChild(item);
        const el = { item, position };
        return el;
      })();
    }
  }

  render() {
    return (
      <Host>
        <div
          class={'ftb-virtual-scroll__content'}
          style={{ height: this.items.length * this.itemHeightPx + 'px' }}
        ></div>
      </Host>
    );
  }
}
