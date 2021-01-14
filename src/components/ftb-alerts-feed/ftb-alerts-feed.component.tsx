import { Component, h, Host, State } from '@stencil/core';
import { Alert, AlertType, diState, User, userState, firebaseState, ProfileService } from 'ftb-models';

@Component({
  tag: 'ftb-alerts-feed',
  styleUrl: 'ftb-alerts-feed.component.scss',
  shadow: false,
})
export class FtbAlertsFeed {
  @State() user: User = userState;
  @State() loadingMore = false;

  async componentWillLoad() {
    this.user.alerts = (await new ProfileService(diState.gql).loadProfileAlerts()).alerts;
    if (firebaseState.messaging) {
      firebaseState.messaging.onMessage(p => {
        console.log('todo: register on message update', p);
      });
    }
  }

  private async loadMoreAlerts() {
    this.loadingMore = true;
    this.user.alerts = (await new ProfileService(diState.gql).loadMoreProfileAlerts(this.user)).alerts;
    this.loadingMore = false;
  }

  render() {
    if (!this.user.alerts?.total) return null;

    return (
      <Host>
        <div class="ftb-alerts-feed__wrapper">
          <div class="ftb-alerts-feed__background">{this.user.alerts.items.map(a => this.renderAlert(a))}</div>
          {this.user.alerts.hasMore() && this.renderLoadMoreButton()}
        </div>
      </Host>
    );
  }

  private renderLoadMoreButton() {
    if (this.loadingMore) {
      return <ftb-spinner></ftb-spinner>;
    } else {
      return <button onClick={() => this.loadMoreAlerts()}>Load more</button>;
      // return <button onClick={() => this.loadMoreAlerts()}>{translations.load_more[userState.language]}</button>;
    }
  }

  private renderAlert(a: Alert) {
    if (a.type === AlertType.article) {
      return <ftb-alert-article alert={a}></ftb-alert-article>;
    } else if (a.type === AlertType.date) {
      return <ftb-alert-date alert={a}></ftb-alert-date>;
    } else if (a.type === AlertType.photo) {
      return <ftb-alert-photo alert={a}></ftb-alert-photo>;
    } else if (a.type === AlertType.result) {
      return <ftb-alert-result alert={a}></ftb-alert-result>;
    } else if (a.type === AlertType.video) {
      return <ftb-alert-video alert={a}></ftb-alert-video>;
    } else if (a.type === AlertType.wish) {
      return <ftb-alert-wish alert={a}></ftb-alert-wish>;
    }
  }
}
