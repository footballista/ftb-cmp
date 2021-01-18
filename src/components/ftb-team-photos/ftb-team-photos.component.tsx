import { Component, Host, h, Prop, State } from '@stencil/core';
import { diState, Team, TeamService } from 'ftb-models';
@Component({
  tag: 'ftb-team-photos',
  styleUrl: 'ftb-team-photos.component.scss',
  shadow: false,
})
export class FtbTeamPhotos {
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
    new TeamService(diState.gql).loadTeamPhotos(this.team._id).then(t => {
      this.team.gamesWithPhotos = t.gamesWithPhotos;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-team-photos__wrapper">
          <div class="ftb-team-photos__background">
            <ftb-media-photos
              photoGames={this.team.gamesWithPhotos}
              paginationConfig={this.paginationConfig}
            ></ftb-media-photos>
          </div>
        </div>
      </Host>
    );
  }
}
