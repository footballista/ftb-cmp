import { Component, Prop, Host, h, Element } from '@stencil/core';
import { Stage, Team } from 'ftb-models';

@Component({
  tag: 'ftb-cup-net-explorer-img-layer',
  styleUrl: 'ftb-cup-net-explorer-img-layer.component.scss',
  shadow: false,
})
export class FtbCupNetExplorerImgLayer {
  @Prop() stage!: Stage;
  @Prop() highlightTeam?: Team;
  @Prop() splitSidesThreshold?: number;

  @Element() containerEl: HTMLElement;
  imgLayerEl: HTMLElement;

  translateX = 0;
  translateY = 0;
  scale = 1;
  grabbing: boolean;
  lastMoveX: number;
  lastMoveY: number;

  eventHandlers = [
    { eventName: 'wheel', handler: this.onWheel },
    { eventName: 'mousedown', handler: this.onMouseDown },
    { eventName: 'mousemove', handler: this.onMouseMove },
  ];

  constructor() {
    this.eventHandlers.forEach(eh => (eh.handler = eh.handler.bind(this)));
    this.mouseUp = this.mouseUp.bind(this);
  }

  componentDidRender() {
    if (this.highlightTeam) {
      const getHightlightedElements = (iteration = 0): Promise<Element[]> =>
        new Promise(resolve => {
          const MAX_ITERATIONS = 10;
          requestAnimationFrame(() => {
            const elements = Array.from(this.imgLayerEl.querySelectorAll('.row.highlighted'));
            if (elements.length) {
              return resolve(elements);
            } else if (iteration > MAX_ITERATIONS) {
              return resolve([]);
            } else {
              return getHightlightedElements(iteration + 1);
            }
          });
        });
      getHightlightedElements().then(e => {
        if (e.length) {
          const SAFETY_PADDING = 20;

          const {
            top: containerTop,
            height: containerHeight,
            left: containerLeft,
            width: containerWidth,
          } = this.containerEl.parentElement.getBoundingClientRect();
          console.log(containerTop, containerHeight);
          const elementsTops = e.map(el => el.getBoundingClientRect().top);
          const hasElementsInContainerViewportY = elementsTops.some(
            t => t > containerTop && t < containerTop + containerHeight,
          );
          if (!hasElementsInContainerViewportY) {
            const middleY = containerTop + containerHeight / 2;
            this.translateY -= elementsTops[0] - middleY - SAFETY_PADDING;
          }
          const elementsLefts = e.map(el => el.getBoundingClientRect().left);
          const hasElementsInContainerViewportX = elementsLefts.some(
            t => t > containerLeft && t < containerLeft + containerWidth,
          );
          if (!hasElementsInContainerViewportX) {
            this.translateX -= elementsLefts[0] - containerLeft - SAFETY_PADDING;
          }
          this.imgLayerEl.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        }
      });
    }
  }

  disconnectedCallback() {
    this.eventHandlers.forEach(eh => this.containerEl.removeEventListener(eh.eventName, eh.handler));
    window.removeEventListener('mouseup', this.mouseUp);
  }

  initLayerEl(el: HTMLElement) {
    if (!this.imgLayerEl) {
      this.imgLayerEl = el;
      this.eventHandlers.forEach(eh => this.containerEl.addEventListener(eh.eventName, eh.handler));
      window.addEventListener('mouseup', this.mouseUp);
    }
  }

  onMouseDown(e: MouseEvent) {
    const MOUSE_BTN_LEFT = 0;
    if (e.button == MOUSE_BTN_LEFT) {
      this.grabbing = true;
      this.lastMoveX = e.clientX;
      this.lastMoveY = e.clientY;
    }
  }
  mouseUp() {
    this.grabbing = false;
  }
  onMouseMove(e: MouseEvent) {
    if (!this.grabbing) return;
    const diffX = e.clientX - this.lastMoveX;
    const diffY = e.clientY - this.lastMoveY;
    this.translateX += diffX;
    this.translateY += diffY;
    this.imgLayerEl.style.transition = 'unset';
    this.imgLayerEl.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    this.lastMoveX = e.clientX;
    this.lastMoveY = e.clientY;
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();
    const MIN_SCALE = 0.4;
    const MAX_SCALE = 1;
    const scaleIncrement = e.deltaY * -0.002;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, this.scale + scaleIncrement));
    if (newScale == this.scale) return;

    /**
     * First we find diff between mouse position and center of transforming image.
     * Then, based on this value and scale change, we calculate layer shift so we keep initial point below cursor
     */
    const { left, top, height, width } = this.imgLayerEl.getBoundingClientRect();
    const middleX = left + width / 2;
    const middleY = top + height / 2;
    const diffX = e.pageX - middleX;
    const diffY = e.pageY - middleY;
    const shiftX = (diffX - diffX * (newScale / this.scale)) * (this.scale / newScale);
    const shiftY = (diffY - diffY * (newScale / this.scale)) * (this.scale / newScale);
    this.translateX += shiftX;
    this.translateY += shiftY;
    this.scale = newScale;
    this.imgLayerEl.style.transition = 'transform .1s linear';
    this.imgLayerEl.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  render() {
    return (
      <Host>
        <ftb-cup-net
          ref={el => this.initLayerEl(el)}
          stage={this.stage}
          highlightTeam={this.highlightTeam}
          splitSidesThreshold={this.splitSidesThreshold}
        />
      </Host>
    );
  }
}
