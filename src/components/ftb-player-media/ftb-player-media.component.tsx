import { Component, Host, h, Prop, State } from '@stencil/core';
import { Player, PlayerService } from 'ftb-models';

@Component({
  tag: 'ftb-player-media',
  styleUrl: 'ftb-player-media.component.scss',
  shadow: false,
})
export class FtbPlayerMedia {
  @Prop() player!: Player;
  @State() loaded: boolean;

  componentWillLoad() {
    new PlayerService().loadPlayerMedia(this.player._id).then(s => {
      this.player.news = s.news;
      this.player.gamesWithPhotos = s.gamesWithPhotos;
      this.player.gamesWithVideos = s.gamesWithVideos;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-player-media__wrapper">
          <div class="ftb-player-media__background">
            <ftb-media
              dataLoaded={this.loaded}
              news={this.player.news}
              photoGames={this.player.gamesWithPhotos}
              videoGames={this.player.gamesWithVideos}
            ></ftb-media>
          </div>
        </div>
      </Host>
    );
  }
}
