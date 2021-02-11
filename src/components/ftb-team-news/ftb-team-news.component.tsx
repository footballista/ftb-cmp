import { Component, Host, h, Prop, State } from '@stencil/core';
import { Team, TeamService } from 'ftb-models';
@Component({
  tag: 'ftb-team-news',
  styleUrl: 'ftb-team-news.component.scss',
  shadow: false,
})
export class FtbTeamNews {
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
    new TeamService().loadTeamNews(this.team._id).then(t => {
      this.team.news = t.news;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-team-news__wrapper">
          <div class="ftb-team-news__background">
            <ftb-media-news news={this.team.news} paginationConfig={this.paginationConfig}></ftb-media-news>
          </div>
        </div>
      </Host>
    );
  }
}
