import { Component, Host, h, Prop, State } from '@stencil/core';
import { Season, SeasonService, diState } from 'ftb-models';

@Component({
  tag: 'ftb-season-media',
  styleUrl: 'ftb-season-media.component.scss',
  shadow: false,
})
export class FtbSeasonMedia {
  @Prop() season!: Season;
  @State() loaded: boolean;

  componentWillLoad() {
    new SeasonService(diState.gql).loadSeasonMedia(this.season._id).then(s => {
      this.season.news = s.news;
      this.season.gamesWithPhotos = s.gamesWithPhotos;
      this.season.gamesWithVideos = s.gamesWithVideos;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-season-media__wrapper">
          <div class="ftb-season-media__background">
            <ftb-media
              dataLoaded={this.loaded}
              news={this.season.news}
              photoGames={this.season.gamesWithPhotos}
              videoGames={this.season.gamesWithVideos}
            ></ftb-media>
          </div>
        </div>
      </Host>
    );
  }
}
