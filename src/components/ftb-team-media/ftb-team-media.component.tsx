import { Component, Host, h, Prop, State } from '@stencil/core';
import { Team, TeamService } from 'ftb-models';

@Component({
  tag: 'ftb-team-media',
  styleUrl: 'ftb-team-media.component.scss',
  shadow: false,
})
export class FtbTeamMedia {
  @Prop() team!: Team;
  @State() loaded: boolean;

  componentWillLoad() {
    new TeamService().loadTeamMedia(this.team._id).then(s => {
      this.team.news = s.news;
      this.team.gamesWithPhotos = s.gamesWithPhotos;
      this.team.gamesWithVideos = s.gamesWithVideos;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-team-media__wrapper">
          <div class="ftb-team-media__background">
            <ftb-media
              dataLoaded={this.loaded}
              news={this.team.news}
              photoGames={this.team.gamesWithPhotos}
              videoGames={this.team.gamesWithVideos}
            ></ftb-media>
          </div>
        </div>
      </Host>
    );
  }
}
