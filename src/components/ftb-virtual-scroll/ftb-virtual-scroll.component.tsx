import { Component, h, Host, Prop, Element, writeTask, Event, EventEmitter } from '@stencil/core';
import { checkElementSize } from 'ftb-models';

interface ListElement {
  item: HTMLElement;
  position: number;
  dragShift?: number;
}

@Component({
  tag: 'ftb-virtual-scroll',
  styleUrl: 'ftb-virtual-scroll.component.scss',
  shadow: false,
})
export class FtbVirtualScroll {
  @Prop() items!: any[];
  @Prop() itemHeightPx!: number;
  @Prop() renderItem!: (item: any) => string;
  @Prop() sortable = false;
  @Event() sorted: EventEmitter;
  itemsPerViewport: number;

  draggedItem: ListElement;
  lastDragY: number;
  lastScrollY: number = 0;

  @Element() el: HTMLElement;
  elements: { [position: number]: ListElement } = {};

  constructor() {
    this.onScroll = this.onScroll.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
  }

  async componentDidLoad() {
    const { height: containerHeight } = await checkElementSize(this.el);
    this.itemsPerViewport = Math.ceil(containerHeight / this.itemHeightPx);
    this.renderRange(0);
    this.el.addEventListener('scroll', this.onScroll);
    this.el.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    this.el.addEventListener('mousemove', this.onMouseMove);
    this.el.addEventListener('touchstart', this.onTouchStart);
    this.el.addEventListener('touchend', this.onTouchEnd);
    this.el.addEventListener('touchmove', this.onTouchMove);
  }

  onScroll() {
    // when scrolling by wheel, holding sorting element
    if (this.draggedItem) {
      this.onItemYChanged(this.el.scrollTop - this.lastScrollY);
    }
    this.lastScrollY = this.el.scrollTop;
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
        this.elements[position].item.remove();
        delete this.elements[position];
      }
    }

    for (let position = range.from; position <= range.to; position++) {
      this.elements[position] ??= (() => {
        const item = document.createElement('ftb-virtual-scroll-item');
        Object.assign(item, { item: this.items[position], renderItem: this.renderItem });
        item.style.transform = `translateY(${position * this.itemHeightPx}px)`;
        this.el.childNodes[0].appendChild(item);
        const el = { item, position, dragShift: 0 };
        return el;
      })();
    }
  }

  onTouchStart(e: TouchEvent) {
    if (!this.sortable) return;
    if (e.target == this.el) return; // processing only click on inner elements

    const item = (e.target as HTMLElement).closest('ftb-virtual-scroll-item');
    item.classList.add('grabbing');
    for (const position in this.elements) {
      if (this.elements[position].item == item) {
        this.draggedItem = this.elements[position];
      }
    }
    this.lastDragY = e.touches[0].clientY;
  }

  onTouchEnd() {
    if (this.draggedItem) {
      const el = this.draggedItem;
      if (el.dragShift) {
        el.dragShift = 0;
        el.item.style.transition = 'transform .1s ease-in-out';
        el.item.style.transform = `translateY(${el.position * this.itemHeightPx}px)`;
        el.item.addEventListener(
          'transitionend',
          () => {
            el.item.classList.remove('grabbing');
            el.item.style.transition = 'transform 0s';
          },
          { once: true },
        );
      } else {
        el.item.classList.remove('grabbing');
      }

      this.draggedItem = undefined;
      this.sorted.emit();
      writeTask(() => this.renderRange(this.el.scrollTop));
    }
  }

  onMouseDown(e: MouseEvent) {
    if (!this.sortable) return;
    if (e.target == this.el) return; // processing only click on inner elements
    const MOUSE_BTN_LEFT = 0;
    if (e.button != MOUSE_BTN_LEFT) return;

    const item = (e.target as HTMLElement).closest('ftb-virtual-scroll-item');
    item.classList.add('grabbing');
    for (const position in this.elements) {
      if (this.elements[position].item == item) {
        this.draggedItem = this.elements[position];
      }
    }
    this.lastDragY = e.clientY;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.draggedItem) return;
    const diffY = e.clientY - this.lastDragY;
    this.lastDragY = e.clientY;
    this.onItemYChanged(diffY);
  }

  onTouchMove(e: TouchEvent) {
    if (!this.draggedItem) return;
    const diffY = e.touches[0].clientY - this.lastDragY;
    this.lastDragY = e.touches[0].clientY;
    this.onItemYChanged(diffY);
    e.preventDefault();
  }

  onItemYChanged(diffY: number) {
    const el = this.draggedItem;
    el.dragShift += diffY;
    el.item.style.transform = `translateY(${el.position * this.itemHeightPx + el.dragShift}px)`;

    const swapPositions = (posChange: 1 | -1) => {
      const nextEl = this.elements[el.position + posChange];
      if (nextEl) {
        if (posChange == 1) {
          this.items.splice(el.position, 2, this.items[el.position + 1], this.items[el.position]);
        } else {
          this.items.splice(el.position - 1, 2, this.items[el.position], this.items[el.position - 1]);
        }

        this.elements[el.position] = nextEl;
        this.elements[nextEl.position] = el;
        nextEl.position -= posChange;
        el.position += posChange;
        el.dragShift -= this.itemHeightPx * posChange;

        nextEl.item.style.transition = 'transform .1s ease-in-out';
        nextEl.item.style.transform = `translateY(${nextEl.position * this.itemHeightPx}px)`;
        nextEl.item.addEventListener(
          'transitionend',
          () => {
            el.item.style.transition = 'transform 0s';
          },
          { once: true },
        );
      }
    };

    if (el.dragShift > this.itemHeightPx / 2) swapPositions(1);
    if (el.dragShift < this.itemHeightPx / -2) swapPositions(-1);
  }

  onMouseUp() {
    if (this.draggedItem) {
      const el = this.draggedItem;
      if (el.dragShift) {
        el.dragShift = 0;
        el.item.style.transition = 'transform .1s ease-in-out';
        el.item.style.transform = `translateY(${el.position * this.itemHeightPx}px)`;
        el.item.addEventListener(
          'transitionend',
          () => {
            el.item.classList.remove('grabbing');
            el.item.style.transition = 'transform 0s';
          },
          { once: true },
        );
      } else {
        el.item.classList.remove('grabbing');
      }

      this.draggedItem = undefined;
      this.sorted.emit();
      writeTask(() => this.renderRange(this.el.scrollTop));
    }
  }

  render() {
    return (
      <Host>
        <div
          class={'ftb-virtual-scroll__content ' + (this.sortable ? 'sortable' : '')}
          style={{ height: this.items.length * this.itemHeightPx + 'px' }}
        ></div>
      </Host>
    );
  }
}
