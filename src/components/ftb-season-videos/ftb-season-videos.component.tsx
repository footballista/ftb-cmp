import { Component, Host, h, Prop, State } from '@stencil/core';
import { diState, Season, SeasonService } from 'ftb-models';
@Component({
  tag: 'ftb-season-videos',
  styleUrl: 'ftb-season-videos.component.scss',
  shadow: false,
})
export class FtbSeasonVideos {
  @Prop() season!: Season;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };
  @State() loaded: boolean;

  componentWillLoad() {
    new SeasonService(diState.gql).loadSeasonMedia(this.season._id).then(s => {
      this.season.gamesWithVideos = s.gamesWithVideos;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-season-videos__wrapper">
          <div class="ftb-season-videos__background">
            <ftb-media-videos
              videoGames={this.season.gamesWithVideos}
              paginationConfig={this.paginationConfig}
            ></ftb-media-videos>
          </div>
        </div>
      </Host>
    );
  }
}
