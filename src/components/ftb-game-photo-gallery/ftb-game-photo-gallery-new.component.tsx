import { Component, Prop, Host, h, Method } from '@stencil/core';
import { envState, Game } from 'ftb-models';
import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js';

@Component({
  tag: 'ftb-game-photo-gallery',
  styleUrl: 'ftb-game-photo-gallery.component.scss',
  shadow: false,
})
export class FtbGamePhotoGallery {
  @Prop() game!: Game;

  lightbox;

  @Method() async open(idx: number) {
    return this.lightbox.loadAndOpen(idx);
  }

  initGallery(el: HTMLDivElement) {
    this.lightbox = new PhotoSwipeLightbox({
      gallery: el,
      children: 'a',
      pswpModule: envState.localHost + '/assets/scripts/photoswipe.esm.js',
      dataSource: this.game.photoset.photos.items.map(i => ({
        msrc: i.thumb.url,
        src: i.full.url,
        srcset: `${i.hd.url} ${i.hd.width}w, ${i.full.url} ${i.full.width}w, ${i.middle.url} ${i.middle.width}w`,
        w: i.hd.width,
        h: i.hd.height,
      })),
    });

    this.lightbox.init();
  }

  render() {
    if (!this.game) return;
    return (
      <Host>
        <div class="gallery" ref={el => this.initGallery(el)}></div>
      </Host>
    );
  }
}
