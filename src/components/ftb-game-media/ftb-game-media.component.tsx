import { Component, Host, h, Prop, State } from '@stencil/core';
import { Game, translations, userState, GameService } from 'ftb-models';

@Component({
  tag: 'ftb-game-media',
  styleUrl: 'ftb-game-media.component.scss',
  shadow: false,
})
export class FtbGameMedia {
  @Prop() game!: Game;
  @State() showGallery: boolean;
  @State() galleryIdx = 0;
  @State() update = 0;
  private gallery: HTMLFtbPhotoGalleryElement;

  componentWillLoad() {
    new GameService().loadGameMedia(this.game._id).then(g => {
      this.game.photoset = g.photoset;
      this.game.videos = g.videos;
      if (window?.location.href.includes('#&gid=')) {
        this.galleryIdx = parseInt(window.location.href.split('&pid=')[1]);
        this.showGallery = true;
      } else {
        this.update++;
      }
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
    const tabs = [];
    if (this.game.photoset?.photos.items.length) {
      tabs.push({
        renderTitle: () => translations.media.photos[userState.language],
        renderContent: () => this.renderPhotoTab(),
      });
    }
    if (this.game.videos?.length) {
      tabs.push({
        renderTitle: () => translations.media.videos[userState.language],
        renderContent: () => this.renderVideoTab(),
      });
    }

    if (!tabs.length) return null;

    return (
      <Host>
        <div class="ftb-game-media__wrapper">
          <div class="ftb-game-media__background">
            <h2 class="component-header">{translations.media.media[userState.language]}</h2>
            <ftb-tabs tabs={tabs}></ftb-tabs>
          </div>
        </div>
      </Host>
    );
  }

  private renderPhotoTab() {
    return (
      <div class="photo-tab">
        <ftb-pagination
          key="game-media-photo"
          totalItems={this.game.photoset.photos.total}
          items={this.game.photoset.photos.items}
          currentIdx={this.galleryIdx}
          renderItem={i => (
            <ftb-game-photo-preview
              photo={i}
              style={{ height: '96px', width: '130px' }}
              onClick={() => this.gallery.open(i)}
            ></ftb-game-photo-preview>
          )}
          rows={3}
          itemMinWidthPx={130}
          itemMinHeightPx={98}
        ></ftb-pagination>
      </div>
    );
  }

  private renderVideoTab() {
    return (
      <div class="video-tab">
        <ftb-pagination
          key="game-media-video"
          totalItems={this.game.videos.length}
          items={this.game.videos}
          renderItem={v => <ftb-video video={v}></ftb-video>}
          rows={1}
          itemMinWidthPx={364}
          itemMinHeightPx={294}
          stretchX={false}
        ></ftb-pagination>
      </div>
    );
  }
}
