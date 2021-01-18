import { Component, Host, h, Prop, State } from '@stencil/core';
import { diState, Team, TeamService } from 'ftb-models';
@Component({
  tag: 'ftb-team-videos',
  styleUrl: 'ftb-team-videos.component.scss',
  shadow: false,
})
export class FtbTeamVideos {
  @Prop() team!: Team;
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
    new TeamService(diState.gql).loadTeamVideos(this.team._id).then(t => {
      this.team.gamesWithVideos = t.gamesWithVideos;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-team-videos__wrapper">
          <div class="ftb-team-videos__background">
            <ftb-media-videos
              videoGames={this.team.gamesWithVideos}
              paginationConfig={this.paginationConfig}
            ></ftb-media-videos>
          </div>
        </div>
      </Host>
    );
  }
}
