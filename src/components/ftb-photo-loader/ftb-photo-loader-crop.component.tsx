import { Component, Event, EventEmitter, h, Host, Prop, Element } from '@stencil/core';
import { translations, userState } from 'ftb-models';
import CloseIcon from '../../assets/icons/close.svg';
import CheckmarkIcon from '../../assets/icons/checkmark.svg';

@Component({
  tag: 'ftb-photo-loader-crop',
  styleUrl: 'ftb-photo-loader-crop.component.scss',
  shadow: false,
})
export class FtbPhotoLoader {
  @Prop() base64: string;
  @Event() crop: EventEmitter<string>;
  @Element() el;
  lastMoveX: number;
  lastMoveY: number;
  lastPinchDistance: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  img;
  cropFrameEl: HTMLElement;

  translateX = 0;
  translateY = 0;
  scale = 1;

  initCanvas(canvas) {
    this.img = new Image();
    this.img.src = this.base64;
    this.canvas = canvas;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.setAttribute('height', window.innerHeight);
    canvas.setAttribute('width', window.innerWidth);
    this.ctx = canvas.getContext('2d');
    this.img.addEventListener('load', () => {
      this.ctx.drawImage(this.img, 0, 0);
    });
    canvas.addEventListener('touchstart', e => {
      this.onTouchStart(e);
    });
    canvas.addEventListener('touchmove', e => {
      this.onTouchMove(e);
    });
  }

  cropImage() {
    const canvas = document.createElement('canvas');
    const { left, top, height, width } = this.cropFrameEl.getBoundingClientRect();
    canvas.height = height;
    canvas.width = width;
    canvas.setAttribute('height', height + '');
    canvas.setAttribute('width', width + '');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      this.img,
      this.translateX - left,
      this.translateY - top,
      this.canvas.width * this.scale,
      this.canvas.height * this.scale,
    );
    this.crop.emit(canvas.toDataURL());
  }

  render() {
    return (
      <Host>
        <div class="backdrop" onClick={() => this.crop.emit(null)} />
        <div class="workbench">
          <canvas ref={e => this.initCanvas(e)} />
          <div class="crop-frame" ref={el => (this.cropFrameEl = el)} />
        </div>
        <div class="control-panel">
          <button onClick={() => this.crop.emit(null)}>
            <ftb-icon svg={CloseIcon} />
            {translations.navigation.cancel[userState.language]}
          </button>
          <button onClick={() => this.cropImage()}>
            <ftb-icon svg={CheckmarkIcon} class="checkmark" />
            {translations.navigation.confirm[userState.language]}
          </button>
        </div>
      </Host>
    );
  }

  onTouchStart(e) {
    if (e.targetTouches.length == 2) {
      const pinch = Object.values(e.targetTouches).map((t: any) => ({ x: t.pageX, y: t.pageY }));
      this.lastPinchDistance = Math.sqrt(
        Math.pow(Math.abs(pinch[0].x - pinch[1].x), 2) + Math.pow(Math.abs(pinch[0].y - pinch[1].y), 2),
      );
    } else {
      this.lastMoveX = e.targetTouches[0].clientX;
      this.lastMoveY = e.targetTouches[0].clientY;
    }
  }

  onTouchMove(e) {
    if (e.targetTouches.length == 2) {
      const pinch = Object.values(e.targetTouches).map((t: any) => ({ x: t.pageX, y: t.pageY }));
      const distance = Math.sqrt(Math.pow(pinch[0].x - pinch[1].x, 2) + Math.pow(pinch[0].y - pinch[1].y, 2));
      const diff = distance - this.lastPinchDistance;

      // const MAX_SCALE = 1;
      const scaleIncrement = diff * 0.001;
      // const newScale = Math.min(MAX_SCALE, Math.max(this.minScale, this.scale + scaleIncrement));
      const newScale = this.scale + scaleIncrement;
      if (newScale == this.scale) return;

      /* First we find diff between mouse position and center of transforming image */
      /* Then, based on this value and scale change, we calculate layer shift so we keep initial point below cursor */
      const { left, top, height, width } = this.el.getBoundingClientRect();
      const middleX = left + width / 2;
      const middleY = top + height / 2;
      const pinchXDiff = (pinch[0].x - pinch[1].x) / 2;
      const pinchXCenter = pinch[0].x + pinchXDiff;
      const pinchYDiff = (pinch[0].y - pinch[1].y) / 2;
      const pinchYCenter = pinch[0].y + pinchYDiff;

      const diffX = pinchXCenter - middleX;
      const diffY = pinchYCenter - middleY;
      const shiftX = (diffX - diffX * (newScale / this.scale)) * (this.scale / newScale);
      const shiftY = (diffY - diffY * (newScale / this.scale)) * (this.scale / newScale);
      this.translateX += shiftX;
      this.translateY += shiftY;

      this.scale = newScale;
      // this.imgLayerEl.style.transition = 'all .1s linear';
      this.applyTransformations();

      this.lastPinchDistance = distance;
    } else {
      const diffX = e.targetTouches[0].clientX - this.lastMoveX;
      const diffY = e.targetTouches[0].clientY - this.lastMoveY;
      this.translateX += diffX;
      this.translateY += diffY;
      // this.imgLayerEl.style.transition = 'unset';
      this.applyTransformations();
      this.lastMoveX = e.targetTouches[0].clientX;
      this.lastMoveY = e.targetTouches[0].clientY;
      e.stopPropagation();
      return false;
    }
  }

  applyTransformations() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.img,
      this.translateX,
      this.translateY,
      this.canvas.width * this.scale,
      this.canvas.height * this.scale,
    );
  }
}
