import { Component, Host, h, Prop, State } from '@stencil/core';
import { League, translations } from 'ftb-models';
import { GraphqlClient } from 'ftb-models/dist/tools/clients/graphql.client';
import { HttpClient } from 'ftb-models/dist/tools/clients/http.client';
import { User } from 'ftb-models/dist/models/user.model';
import { LeagueService } from 'ftb-models/dist/services/league.service';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-league-media',
  styleUrl: 'ftb-league-media.component.scss',
  shadow: false,
})
export class FtbLeagueMedia {
  @Prop() league!: League;
  @State() loaded = false;

  componentDidLoad() {
    //todo move somewhere
    const gql = new GraphqlClient(new HttpClient('AFL_RU', new User()), 'http://localhost:3004/graphql/');
    new LeagueService(gql).loadLeagueMedia(this.league._id).then(l => {
      // this.league.gamesWithPhotos = l.gamesWithPhotos;
      // this.league.gamesWithVideos = l.gamesWithVideos;
      this.league.news = l.news;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-league-media__wrapper">
          <div class="ftb-league-media__background">
            <h2 class="component-header">{translations.media.latest_media[userState.language]}</h2>
            <div class="ftb-league-media__content">
              <ftb-media
                news={this.league.news}
                photoGames={this.league.gamesWithPhotos}
                videoGames={this.league.gamesWithVideos}
                dataLoaded={this.loaded}
              ></ftb-media>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
