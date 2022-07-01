import { Component, Event, EventEmitter, h, Host, State } from '@stencil/core';
import PlusIcon from '../../assets/icons/plus.svg';
import CameraIcon from '../../assets/icons/photo.svg';
import ImageIcon from '../../assets/icons/image.svg';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  tag: 'ftb-photo-loader',
  styleUrl: 'ftb-photo-loader.component.scss',
  shadow: false,
})
export class FtbPhotoLoader {
  @Event() newImg: EventEmitter<string>;
  @State() modeButtonsOpen: boolean;
  @State() processingPhoto: boolean;
  @State() img: string;

  render() {
    return <Host>{this.renderFrame()}</Host>;
  }

  renderFrame() {
    return (
      <div class={'frame ' + (this.modeButtonsOpen ? 'mode-open' : '')}>
        <div class={'slot ' + (this.img ? 'hidden' : '')}>
          <slot />
        </div>
        <img class={'new-img ' + (!this.img ? 'hidden' : 'visible')} src={this.img} />
        <div class="frame-backdrop" />
        <button
          onClick={() => (this.modeButtonsOpen = !this.modeButtonsOpen)}
          disabled={this.processingPhoto}
          class="mode-select-button"
        >
          <ftb-icon svg={PlusIcon} />
        </button>

        <button
          onClick={() => this.pickPhoto(CameraSource.Photos)}
          disabled={this.processingPhoto}
          class="mode-button gallery"
        >
          <ftb-icon svg={ImageIcon} />
        </button>

        <button
          onClick={() => this.pickPhoto(CameraSource.Camera)}
          disabled={this.processingPhoto}
          class="mode-button camera"
        >
          <ftb-icon svg={CameraIcon} />
        </button>
      </div>
    );
  }

  async pickPhoto(source: CameraSource) {
    this.modeButtonsOpen = false;
    if (!this.processingPhoto) {
      this.processingPhoto = true;
      const el = document.createElement('ftb-photo-loader-crop');
      el.addEventListener(
        'crop',
        e => {
          this.img = e['detail'];
          el.classList.add('closed');
          el.addEventListener('transitionend', () => el.remove(), { once: true });
          this.newImg.emit(e['detail']);
        },
        { once: true },
      );
      document.body.appendChild(el);

      try {
        setTimeout(() => {
          this.processingPhoto = false;
          console.log('processing photo');
        }, 1000); // promise isn't resolved when user clicks "cancel" while picking photo

        const img = (
          await Camera.getPhoto({
            resultType: CameraResultType.DataUrl,
            source: source,
            quality: 100,
            allowEditing: false,
          })
        ).dataUrl;

        Object.assign(el, { base64: img });
      } catch (e) {
        console.error(e);
      } finally {
        this.processingPhoto = false;
      }
    }
  }
}
