import { Component, h, Prop } from '@stencil/core';
import { routingStore } from '@src/tools/routing.store';
@Component({
  tag: 'ftb-link',
  styleUrl: 'ftb-link.component.scss',
  shadow: false,
})
export class FtbLink {
  @Prop() route!: string;
  @Prop() params: { [key: string]: string | number };
  private url: string;

  componentWillLoad() {
    if (routingStore.routes[this.route]) {
      let url = routingStore.routes[this.route];
      if (this.params) {
        for (const key in this.params) {
          url = url.replace(':' + key, this.params[key] + '');
        }
      }
      this.url = url;
    }
  }

  render() {
    return (
      <a href={this.url}>
        <slot></slot>
      </a>
    );
  }
}
