import { Component, Host, h, Prop, State } from '@stencil/core';
import { Season, SeasonService } from 'ftb-models';
@Component({
  tag: 'ftb-season-photos',
  styleUrl: 'ftb-season-photos.component.scss',
  shadow: false,
})
export class FtbSeasonPhotos {
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
      this.season.gamesWithPhotos = s.gamesWithPhotos;
      this.loaded = true;
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-season-photos__wrapper">
          <div class="ftb-season-photos__background">
            <ftb-media-photos
              photoGames={this.season.gamesWithPhotos}
              paginationConfig={this.paginationConfig}
            ></ftb-media-photos>
          </div>
        </div>
      </Host>
    );
  }
}
