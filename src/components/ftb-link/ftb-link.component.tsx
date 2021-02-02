import { Component, h, Prop } from '@stencil/core';
import { envState, routingState } from 'ftb-models';

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
    if (routingState.routes[this.route]) {
      let url = routingState.routes[this.route];
      if (this.params) {
        for (const key in this.params) {
          url = url.replace(':' + key, encodeURI(this.params[key] + ''));
        }
      }

      this.url = url;
    }
  }

  render() {
    if (envState.appMode === 'ionic') {
      return (
        <ion-router-link href={this.url}>
          <slot></slot>
        </ion-router-link>
      );
    } else {
      return (
        <a href={this.url}>
          <slot></slot>
        </a>
      );
    }
  }
}
