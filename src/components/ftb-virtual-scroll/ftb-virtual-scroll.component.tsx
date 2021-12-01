import { Component, Host, h, Prop } from '@stencil/core';
@Component({
  tag: 'ftb-virtual-scroll',
  styleUrl: 'ftb-virtual-scroll.component.scss',
  shadow: false,
})
export class FtbVirtualScroll {
  @Prop() items!: any[];
  @Prop() itemHeight!: number;
  @Prop() renderItem!: (item: any) => string;

  // todo implement all virtual scroll logic
  render() {
    return (
      <Host>
        <div class="list" style={{ height: this.items.length * this.itemHeight + 'px' }}>
          {this.items.map(i => this.renderItem(i))}
        </div>
      </Host>
    );
  }
}
