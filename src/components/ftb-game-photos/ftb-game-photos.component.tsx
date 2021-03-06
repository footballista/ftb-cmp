import { Component, Host, h, Prop, State } from '@stencil/core';
import { Game, GamePhoto, GameService } from 'ftb-models';
import { FtbCustomLinkProp } from '../ftb-link/ftb-custom-link-prop';

@Component({
  tag: 'ftb-game-photos',
  styleUrl: 'ftb-game-photos.component.scss',
  shadow: false,
})
export class FtbGamePhotos {
  @Prop() game!: Game;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };
  @Prop() customRoute: FtbCustomLinkProp;
  @State() loaded: boolean;
  @State() showGallery: boolean;
  @State() galleryIdx = 0;
  @State() update = 0;
  private gallery: HTMLFtbPhotoGalleryElement;

  componentWillLoad() {
    new GameService().loadGamePhotos(this.game._id).then(g => {
      this.game.photoset = g.photoset;
      if (window?.location.href.includes('#&gid=')) {
        this.galleryIdx = parseInt(window.location.href.split('&pid=')[1]);
        this.showGallery = true;
      }
      this.loaded = true;
    });
  }

  connectedCallback() {
    this.gallery = Object.assign(document.createElement('ftb-photo-gallery'), {
      game: this.game,
    });
    this.gallery.addEventListener('slideChanged', (e: CustomEvent) => (this.galleryIdx = e.detail));

    document.body.appendChild(this.gallery);
  }

  render() {
    const openGallery = (photo: GamePhoto) => {
      this.gallery.open(this.game.photoset.photos.items.findIndex(p => p.thumb === photo.thumb));
    };

    return (
      <Host>
        {/*{this.showGallery && (*/}
        {/*  <ftb-photo-gallery*/}
        {/*    game={this.game}*/}
        {/*    onClosed={() => (this.showGallery = false)}*/}
        {/*    start={this.galleryIdx}*/}
        {/*    onSlideChanged={e => (this.galleryIdx = e.detail)}*/}
        {/*  />*/}
        {/*)}*/}
        {this.paginationConfig ? (
          <ftb-pagination
            key="game-media-photo"
            totalItems={this.game.photoset.photos.total}
            items={this.game.photoset.photos.items}
            currentIdx={this.galleryIdx}
            renderItem={i => <ftb-game-photo-preview photo={i} onClick={() => openGallery(i)} />}
            rows={this.paginationConfig.rows}
            fixedContainerHeightPx={this.paginationConfig.fixedContainerHeightPx}
            itemMinWidthPx={this.paginationConfig.itemMinWidthPx}
            itemMinHeightPx={this.paginationConfig.itemMinHeightPx}
            stretchX={this.paginationConfig.stretchX}
            stretchY={this.paginationConfig.stretchY}
            XtoY={this.paginationConfig.XtoY}
          ></ftb-pagination>
        ) : (
          this.game.photoset.photos.items.map(i => <ftb-game-photo-preview photo={i} onClick={() => openGallery(i)} />)
        )}
      </Host>
    );
  }
}
