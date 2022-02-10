import { Component, Event, EventEmitter, h, Host, Prop, Method, forceUpdate, Element } from '@stencil/core';
import { createEntityRoute, Game, RoleLevel, translations, userState } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
import PhotoSwipe from 'photoswipe/';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'ftb-game-photo-gallery',
  styleUrl: 'ftb-game-photo-gallery.component.scss',
  shadow: false,
})
export class FtbPhotoGallery {
  @Prop() game!: Game;

  @Event() slideChanged: EventEmitter<number>;
  @Event() closed: EventEmitter<boolean>;
  @Element() el: HTMLElement;

  @Method() async open(startIdx: number) {
    const width = this.el.offsetWidth;
    const items = this.game.photoset.photos.items.map(p => {
      const getUrl = () => {
        if (width > p.full.width) {
          return p.hd.url;
        } else if (width > p.middle.width) {
          return p.full.url;
        } else {
          return p.middle.url;
        }
      };

      return {
        src: getUrl(),
        currSize: 'middle',
        msrc: p.thumb.url,
        w: p.hd?.width || p.full?.width || p.middle?.width || p.thumb?.width,
        h: p.hd?.height || p.full?.height || p.middle?.height || p.thumb?.height,
        all: p,
        title: 'test title',
      };
    });

    this.gallery = new PhotoSwipe(this.pswpEl, PhotoSwipeUI_Default, items, {
      index: startIdx,
      shareEl: true,
      captionEl: true,
      shareButtons: [{ id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true }],
      addCaptionHTMLFn: () => true,
    });
    this.gallery.listen('destroy', () => {
      this.closed.emit(true);
    });
    this.gallery.init();
    this.gallery.listen('afterChange', () => {
      forceUpdate(this.el);
      this.slideChanged.emit(this.gallery.getCurrentIndex());
    });
    forceUpdate(this.el);
  }

  private pswpEl: HTMLDivElement;
  private gallery;
  private destroyed$ = new AsyncSubject<boolean>();

  disconnectedCallback() {
    this.gallery = null;
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  render() {
    if (!this.game) return;

    return (
      <Host>
        {this.renderSlider()}
        {/*{this.renderHelperImages()}*/}
      </Host>
    );
  }

  // private renderHelperImages() {
  //   if (!this.gallery) return;
  //   const currIdx = this.gallery.getCurrentIndex();
  //
  //   const getIdx = idx => {
  //     if (idx < 0) return this.game.photoset.photos.items.length + idx;
  //     if (idx >= this.game.photoset.photos.items.length) return idx - this.game.photoset.photos.items.length;
  //     return idx;
  //   };
  //
  //   const onImgLoad = (index, size) => {
  //     if (this.gallery) {
  //       if (size === 'hd') {
  //         this.gallery.items[index].currSize = size;
  //         this.gallery.items[index].src = this.game.photoset.photos.items[index].hd.url;
  //         this.gallery.invalidateCurrItems();
  //         this.gallery.updateSize(true);
  //       } else if (size === 'full' && this.gallery.items[index].currSize !== 'hd') {
  //         this.gallery.items[index].currSize = size;
  //         this.gallery.items[index].src = this.game.photoset.photos.items[index].full.url;
  //         this.gallery.invalidateCurrItems();
  //         this.gallery.updateSize(true);
  //       }
  //     }
  //   };
  //
  //   return (
  //     <div class="help-images">
  //       {[getIdx(currIdx - 1), getIdx(currIdx), getIdx(currIdx + 1)].map(i => {
  //         const photo = this.game.photoset.photos.items[i];
  //         return (
  //           <div>
  //             {this.game.photoset.photos.items[i].hd &&
  //               (this.pswpEl.offsetWidth > photo.full.width || this.pswpEl.offsetHeight > photo.full.height) && (
  //                 <img src={this.game.photoset.photos.items[i].hd.url} onLoad={() => onImgLoad(i, 'hd')} />
  //               )}
  //             <img src={this.game.photoset.photos.items[i].full?.url} onLoad={() => onImgLoad(i, 'full')} />
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // }

  private renderSlider() {
    return (
      <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" ref={el => (this.pswpEl = el)}>
        <div class="pswp__bg" />
        <div class="pswp__scroll-wrap">
          <div class="pswp__container">
            <div class="pswp__item" />
            <div class="pswp__item" />
            <div class="pswp__item" />
          </div>

          <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
              <div class="pswp__counter" />
              <button class="pswp__button pswp__button--close" title="Close (Esc)" />
              <button class="pswp__button pswp__button--share" title="Share" />
              <button class="pswp__button pswp__button--fs" title="Toggle fullscreen" />
              <button class="pswp__button pswp__button--zoom" title="Zoom in/out" />
              <div class="pswp__preloader">
                <div class="pswp__preloader__icn">
                  <div class="pswp__preloader__cut">
                    <div class="pswp__preloader__donut" />
                  </div>
                </div>
              </div>
            </div>
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div class="pswp__share-tooltip" />
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)" />
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)" />
            <div class="pswp__caption">
              <div class="pswp__caption__center">{this.renderCaption()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderCaption() {
    const photographer = this.game.staff.find(s => s.role === RoleLevel.photographer);
    return (
      <div class="caption">
        <div class="teams">
          {this.game.home.team.name} - {this.game.away.team.name}
        </div>
        <div class="tour">
          {this.game.champ.name} - {this.game.season.name}, <ftb-game-tour game={this.game} />
        </div>
        {photographer && (
          <div class="photo-by">
            {translations.game.photo_by[userState.language]}:
            <a {...href(createEntityRoute(photographer.user))}>{photographer.user.name}</a>
          </div>
        )}
      </div>
    );
  }
}
