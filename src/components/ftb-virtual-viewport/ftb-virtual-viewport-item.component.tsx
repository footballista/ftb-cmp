import { Component, Prop, Element } from '@stencil/core';

/**
 *  We only need this component to create it dynamically from ftb-virtual-scroll with `document.createElement`
 *  probably we can replace it with proper calling of h() or something like that
 */
@Component({
  tag: 'ftb-virtual-viewport-item',
  shadow: false,
})
export class FtbVirtualScrollItem {
  @Prop() item!: any;
  @Prop() renderItem!: (item: any) => string;
  @Element() el;

  disconnectedCallback() {
    // cancelling img load
    Array.from(this.el.querySelectorAll('img')).forEach((img: HTMLImageElement) => (img.src = ''));
  }

  render() {
    if (!this.item) return;

    return this.renderItem(this.item);
  }
}
