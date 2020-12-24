import { Component, Host, h, Prop } from '@stencil/core';
import { League, Post, translations } from 'ftb-models';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-league-media',
  styleUrl: 'ftb-league-media.component.scss',
  shadow: false,
})
export class FtbLeagueMedia {
  @Prop() league!: League;

  componentWillLoad() {
    for (let i = 0; i < this.league.news.total; i++) {
      this.league.news.items[i] ??= new Post({});
    }
  }

  render() {
    const tabs = [];
    if (this.league.news?.total) {
      tabs.push({
        renderTitle: () => translations.media.news[userState.language],
        renderContent: () => <ftb-league-media-news-tab league={this.league}></ftb-league-media-news-tab>,
      });
    }
    if (this.league.gamesWithPhotos?.total) {
      tabs.push({
        renderTitle: () => translations.media.photos[userState.language],
        renderContent: () => <ftb-league-media-photo-tab league={this.league}></ftb-league-media-photo-tab>,
      });
    }
    if (this.league.gamesWithVideos?.total) {
      tabs.push({
        renderTitle: () => translations.media.videos[userState.language],
        renderContent: () => <ftb-league-media-video-tab league={this.league}></ftb-league-media-video-tab>,
      });
    }

    return (
      <Host>
        <div class="ftb-league-media__wrapper">
          <div class="ftb-league-media__background">
            <h2 class="component-header">{translations.media.latest_media[userState.language]}</h2>
            <div class="ftb-league-media__content">
              <ftb-tabs tabs={tabs}></ftb-tabs>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
