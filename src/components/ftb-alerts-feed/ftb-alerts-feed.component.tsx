import { Component, Host, h } from '@stencil/core';
import fireServicesState from '@src/tools/firebase-services.store';

@Component({
  tag: 'ftb-alerts-feed',
  styleUrl: 'ftb-alerts-feed.component.scss',
  shadow: true,
})
export class FtbAlertsFeed {
  componentWillLoad() {
    if (fireServicesState.messaging) {
      fireServicesState.messaging.onMessage(p => {
        console.log('todo: register on message update', p);
      });
    }
  }

  render() {
    return <Host>ALERTS FEED</Host>;
  }
}
