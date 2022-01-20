import { Component, Host, h } from '@stencil/core';
import ExpandIcon from '../../assets/icons/expand.svg';

@Component({
  tag: 'ftb-cup-net-explorer',
  styleUrl: 'ftb-cup-net-explorer.component.scss',
  shadow: false,
})
export class FtbStageCupNetExplorer {
  explorerEl: HTMLElement;
  scaleLayer: HTMLElement;
  wrapperEl: HTMLElement;

  disconnectedCallback() {
    // todo remove all event listeners
  }

  render() {
    let translateX = 0;
    let translateY = 0;
    let grabbing = false;
    let lastX = null;
    let lastY = null;
    let scale = 1;
    const onMouseDown = e => {
      lastX = e.clientX;
      lastY = e.clientY;
      grabbing = true;
      this.explorerEl.style.transition = 'unset';
      this.explorerEl.classList.add('grabbing');
    };

    const onTouchStart = e => {
      console.log('touch', e);
    };

    const onMouseUp = () => {
      grabbing = false;
      this.explorerEl.classList.remove('grabbing');
    };

    const onMouseOver = () => {
      grabbing = false;
      this.explorerEl.classList.remove('grabbing');
    };

    const onMouseMove = e => {
      if (!grabbing) return;
      const diffX = e.clientX - lastX;
      const diffY = e.clientY - lastY;
      translateX += diffX;
      translateY += diffY;
      lastX = e.clientX;
      lastY = e.clientY;
      this.explorerEl.style.transform = `translate(${translateX}px, ${translateY}px)`;
    };

    const onWheel = e => {
      e.preventDefault();
      e.stopPropagation();

      const MIN_SCALE = 0.4;
      const MAX_SCALE = 1;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + e.deltaY * -0.002));
      if (newScale == scale) return;

      // console.log(newScale, scale, scale + (1 - 2 ** (e.deltaY * 0.002)));
      // const scaleRatio = newScale / scale;

      // const { left, top } = this.explorerEl.getBoundingClientRect();
      // const mousePositionX = e.clientX - left - translateX;
      // const mousePositionY = e.clientY - top - translateY;
      //
      // const coordChangeX = scaleRatio * mousePositionX - mousePositionX;
      // const coordChangeY = scaleRatio * mousePositionY - mousePositionY;
      //
      // console.log(coordChangeX, coordChangeY);
      //
      // translateX -= coordChangeX;
      // translateY -= coordChangeY;

      if (e.deltaY < 0) {
        // zooming in

        console.log('in');
      }
      //
      // const { left, top, height, width } = this.wrapperEl.getBoundingClientRect();
      // const middleX = left + width / 2;
      // const middleY = top + height / 2;
      //
      // const pointDiffX = middleX - e.pageX;
      // const pointDiffY = e.pageY - middleY;
      // console.log(pointDiffX * newScale);
      // pointDiffY;
      //
      // translateX += pointDiffX * newScale;

      // const { height, width } = this.explorerEl.getBoundingClientRect();
      // const scaleDiff = scale - newScale;
      // const diffX = (width * scaleDiff) / 2;
      // const diffY = (height * scaleDiff) / 2;
      // translateX -= diffX;
      // translateY -= diffY;
      // console.log(diffX);
      // console.log(height, width, scaleDiff);
      // }

      // const sizeChange;
      scale = newScale;
      this.scaleLayer.style.transform = `scale(${scale})`;
      // this.explorerEl.style.transform = `translate(${translateX}px, ${translateY}px)`;
    };

    return (
      <Host>
        <div
          class="compact-wrapper"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onMouseMove={onMouseMove}
          onMouseOver={onMouseOver}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
          ref={el => {
            this.wrapperEl = el;
          }}
        >
          <div class="explorer-content" ref={el => (this.explorerEl = el)}>
            <div class="scale-layer" ref={el => (this.scaleLayer = el)}>
              <slot />
            </div>
          </div>
          <button class="zoom-button">
            <ftb-icon svg={ExpandIcon} />
          </button>
        </div>
      </Host>
    );
  }
}
