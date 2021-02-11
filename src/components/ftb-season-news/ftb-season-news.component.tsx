import { Component, Host, h, Prop, State } from '@stencil/core';
import { Season, SeasonService } from 'ftb-models';
@Component({
  tag: 'ftb-season-news',
  styleUrl: 'ftb-season-news.component.scss',
  shadow: false,
})
export class FtbSeasonNews {
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
    new SeasonService().loadSeasonMedia(this.season._id).then(s => {
      this.season.news = s.news;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-season-news__wrapper">
          <div class="ftb-season-news__background">
            <ftb-media-news news={this.season.news} paginationConfig={this.paginationConfig}></ftb-media-news>
          </div>
        </div>
      </Host>
    );
  }
}
