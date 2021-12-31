import { Component, h, Host, State } from '@stencil/core';
import { Game, GameService } from 'ftb-models';

@Component({
  tag: 'ftb-game-photo-gallery-stories',
  styleUrl: 'ftb-game-photo-gallery.stories.scss',
  shadow: false,
})
export class FtbGamePhotoGalleryStories {
  @State() game: Game;
  gallery: HTMLFtbGamePhotoGalleryElement;
  @State() galleryIdx = 0;

  componentWillLoad() {
    new GameService().loadGamePhotos(313299).then(g => {
      this.game = g;
      this.initGallery();
    });
  }

  initGallery() {
    // this.gallery = Object.assign(document.createElement('ftb-game-photo-gallery-2'), {
    //   game: this.game,
    // }) as HTMLFtbGamePhotoGalleryElement;
    // this.gallery.addEventListener('slideChanged', (e: CustomEvent) => (this.galleryIdx = e.detail));
    // document.body.appendChild(this.gallery);
    // if (window?.location.href.includes('#&gid=')) {
    //   this.galleryIdx = parseInt(window.location.href.split('&pid=')[1]);
    //   this.gallery.open(this.galleryIdx);
    // }
  }

  render() {
    return (
      <Host>
        <ion-content>
          <ftb-game-photo-gallery game={this.game} ref={el => (this.gallery = el)} />

          <h1>Photo gallery</h1>
          <p>Renders photo viewer for provided game</p>
          <p>Click on photo to open gallery</p>
          {this.game ? this.renderGamePhotos() : <ftb-spinner />}
        </ion-content>
      </Host>
    );
  }

  renderGamePhotos() {
    const openGallery = (idx: number) => {
      this.gallery.open(idx);
    };

    return (
      <div class="grid">
        {this.game.photoset.photos.items.map((p, idx) => (
          <div class="image-container" onClick={() => openGallery(idx)}>
            <img src={p.thumb.url} class="photo" loading="lazy" />
            <img src={p.middle.url} class="photo" loading="lazy" />
          </div>
        ))}
      </div>
    );
  }
}
