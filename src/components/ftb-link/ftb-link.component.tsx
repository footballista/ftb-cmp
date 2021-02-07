import { Component, h, Prop } from '@stencil/core';
import { envState, routingState } from 'ftb-models';
import { buildRoute } from 'ftb-models/dist/tools/build-route';

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
      this.url = buildRoute(routingState.routes[this.route], this.params);
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
