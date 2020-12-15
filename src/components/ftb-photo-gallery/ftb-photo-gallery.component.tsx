import { Component, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';
import { Game, RoleLevel, translations } from 'ftb-models';
import { AsyncSubject } from 'rxjs';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-photo-gallery',
  styleUrl: 'ftb-photo-gallery.component.scss',
  shadow: false,
})
export class FtbPhotoGallery {
  @Prop() game!: Game;
  @Prop() start!: number;
  @State() update = 0;
  @Event() closed: EventEmitter<boolean>;
  @Event() photographerClicked: EventEmitter<number>;
  private destroyed$ = new AsyncSubject<boolean>();
  private pswpEl: HTMLDivElement;
  private gallery;

  componentDidLoad() {
    const items = this.game.photoset.photos.items.map(p => ({
      src: p.middle.url,
      currSize: 'middle',
      msrc: p.thumb.url,
      w: p.hd?.width || p.full?.width || p.middle?.width || p.thumb?.width,
      h: p.hd?.height || p.full?.height || p.middle?.height || p.thumb?.height,
      all: p,
      title: 'test title',
    }));

    this.gallery = new PhotoSwipe(this.pswpEl, PhotoSwipeUI_Default, items, {
      index: this.start,
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
      this.update++;
    });
    this.update++;
  }

  disconnectedCallback() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  render() {
    return (
      <Host>
        {this.renderTestSlider()}
        {this.renderHelperImages()}
      </Host>
    );
  }

  private renderHelperImages() {
    if (!this.gallery) return;
    const currIdx = this.gallery.getCurrentIndex();

    const getIdx = idx => {
      if (idx < 0) return this.game.photoset.photos.items.length + idx;
      if (idx >= this.game.photoset.photos.items.length) return idx - this.game.photoset.photos.items.length;
      return idx;
    };

    const onImgLoad = (index, size) => {
      if (this.gallery) {
        if (size === 'hd') {
          this.gallery.items[index].currSize = size;
          this.gallery.items[index].src = this.game.photoset.photos.items[index].hd.url;
          this.gallery.invalidateCurrItems();
          this.gallery.updateSize(true);
        } else if (size === 'full' && this.gallery.items[index].currSize !== 'hd') {
          this.gallery.items[index].currSize = size;
          this.gallery.items[index].src = this.game.photoset.photos.items[index].full.url;
          this.gallery.invalidateCurrItems();
          this.gallery.updateSize(true);
        }
      }
    };

    return (
      <div class="help-images">
        {[getIdx(currIdx - 1), getIdx(currIdx), getIdx(currIdx + 1)].map(i => {
          const photo = this.game.photoset.photos.items[i];
          return (
            <div>
              {this.game.photoset.photos.items[i].hd &&
                (this.pswpEl.offsetWidth > photo.full.width || this.pswpEl.offsetHeight > photo.full.height) && (
                  <img src={this.game.photoset.photos.items[i].hd.url} onLoad={() => onImgLoad(i, 'hd')} />
                )}
              <img src={this.game.photoset.photos.items[i].full?.url} onLoad={() => onImgLoad(i, 'full')} />
            </div>
          );
        })}
      </div>
    );
  }

  private renderTestSlider() {
    return (
      <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" ref={el => (this.pswpEl = el)}>
        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">
          <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
          </div>

          <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
              <div class="pswp__counter"></div>
              <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
              <button class="pswp__button pswp__button--share" title="Share"></button>
              <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
              <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
              <div class="pswp__preloader">
                <div class="pswp__preloader__icn">
                  <div class="pswp__preloader__cut">
                    <div class="pswp__preloader__donut"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div class="pswp__share-tooltip"></div>
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
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
          {this.game.champ.name} - {this.game.season.name}, <ftb-game-tour game={this.game}></ftb-game-tour>
        </div>
        {photographer && (
          <div class="photo-by">
            {translations.game.photo_by[userState.language]}:
            <a onClick={() => this.photographerClicked.emit(photographer.user._id)}>{photographer.user.name}</a>
          </div>
        )}
      </div>
    );
  }
}
