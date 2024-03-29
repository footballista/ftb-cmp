import { Component, Prop, Host, h, Element, Build, readTask } from '@stencil/core';
import { Stage, Team } from 'ftb-models';

@Component({
  tag: 'ftb-cup-net-explorer-img-layer',
  styleUrl: 'ftb-cup-net-explorer-img-layer.component.scss',
  shadow: false,
})
export class FtbCupNetExplorerImgLayer {
  @Prop() stage!: Stage;
  @Prop() highlightTeam?: Team;
  @Prop() highlightTeams?: Team[];
  @Prop() splitSidesThreshold?: number;
  @Prop() disabled?: boolean;

  @Element() containerEl: HTMLElement;
  imgLayerEl: HTMLElement;

  translateX = 0;
  translateY = 0;
  scale = 1;
  grabbing: boolean;
  lastMoveX: number;
  lastMoveY: number;
  lastPinchDistance: number;
  /** minimal available scale. Will be calculated based on net size so in minimal scale whole net will be visible */
  minScale = 1;

  eventHandlers = [
    { eventName: 'wheel', handler: this.onWheel, target: () => this.containerEl },
    { eventName: 'mousedown', handler: this.onMouseDown, target: () => this.containerEl },
    { eventName: 'mousemove', handler: this.onMouseMove, target: () => this.containerEl },
    { eventName: 'mouseup', handler: this.onMouseUp, target: () => window },
    { eventName: 'touchstart', handler: this.onTouchStart, target: () => window },
    { eventName: 'touchmove', handler: this.onTouchMove, target: () => window },
  ];

  resizeObserver;

  constructor() {
    this.eventHandlers.forEach(eh => (eh.handler = eh.handler.bind(this)));
  }

  componentDidLoad() {
    const defineMinScale = () => {
      const { height: imgHeihgt, width: imgWidth } = this.imgLayerEl.getBoundingClientRect();
      const { height: containerHeight, width: containerWidth } = this.containerEl.getBoundingClientRect();
      this.minScale = Math.min(containerHeight / imgHeihgt, containerWidth / imgWidth);
    };

    if (Build.isBrowser) {
      this.resizeObserver = new ResizeObserver(() => {
        defineMinScale();
      });
      this.resizeObserver.observe(this.containerEl);
    }

    defineMinScale();
  }

  applyTransformations() {
    this.imgLayerEl.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    readTask(() => {
      let newTranslateY = this.translateY;
      const maxShiftY =
        (this.imgLayerEl.getBoundingClientRect().height - this.containerEl.getBoundingClientRect().height) / 2;
      if (maxShiftY >= 0) {
        newTranslateY = Math.min(newTranslateY, maxShiftY);
        newTranslateY = Math.max(newTranslateY, -1 * maxShiftY);
      } else {
        newTranslateY = Math.max(newTranslateY, maxShiftY);
        newTranslateY = Math.min(newTranslateY, -1 * maxShiftY);
      }

      let newTranslateX = this.translateX;
      const maxShiftX =
        (this.imgLayerEl.getBoundingClientRect().width - this.containerEl.getBoundingClientRect().width) / 2;

      if (maxShiftX >= 0) {
        newTranslateX = Math.min(newTranslateX, maxShiftX);
        newTranslateX = Math.max(newTranslateX, -1 * maxShiftX);
      } else {
        newTranslateX = Math.max(newTranslateX, maxShiftX);
        newTranslateX = Math.min(newTranslateX, -1 * maxShiftX);
      }
      if (newTranslateX != this.translateX || newTranslateY != this.translateY) {
        this.translateX = newTranslateX;
        this.translateY = newTranslateY;
        this.applyTransformations();
      }
    });
  }

  componentDidRender() {
    if (this.highlightTeam || this.highlightTeams) {
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
          this.applyTransformations();
        }
      });
    }
  }

  disconnectedCallback() {
    this.eventHandlers.forEach(eh => eh.target().removeEventListener(eh.eventName, eh.handler));
    this.resizeObserver?.disconnect();
  }

  initLayerEl(el: HTMLElement) {
    if (!this.imgLayerEl) {
      this.imgLayerEl = el;

      if (!this.disabled) {
        this.eventHandlers.forEach(eh => eh.target().addEventListener(eh.eventName, eh.handler));
      }
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

  onMouseUp() {
    this.grabbing = false;
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

      const MAX_SCALE = 1;
      const scaleIncrement = diff * 0.005;
      const newScale = Math.min(MAX_SCALE, Math.max(this.minScale, this.scale + scaleIncrement));
      if (newScale == this.scale) return;

      /* First we find diff between mouse position and center of transforming image */
      /* Then, based on this value and scale change, we calculate layer shift so we keep initial point below cursor */
      const { left, top, height, width } = this.imgLayerEl.getBoundingClientRect();
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
      this.imgLayerEl.style.transition = 'unset';
      this.applyTransformations();
      this.lastMoveX = e.targetTouches[0].clientX;
      this.lastMoveY = e.targetTouches[0].clientY;
      e.stopPropagation();
      return false;
    }
  }

  onMouseMove(e: MouseEvent) {
    if (!this.grabbing) return;
    const diffX = e.clientX - this.lastMoveX;
    const diffY = e.clientY - this.lastMoveY;
    this.translateX += diffX;
    this.translateY += diffY;

    this.imgLayerEl.style.transition = 'unset';
    this.applyTransformations();
    this.lastMoveX = e.clientX;
    this.lastMoveY = e.clientY;
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    const MAX_SCALE = 1;
    const scaleIncrement = e.deltaY * -0.002;
    const newScale = Math.min(MAX_SCALE, Math.max(this.minScale, this.scale + scaleIncrement));
    if (newScale == this.scale) return;

    /* First we find diff between mouse position and center of transforming image */
    /* Then, based on this value and scale change, we calculate layer shift so we keep initial point below cursor */
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
    // this.imgLayerEl.style.transition = 'all .1s linear';
    this.applyTransformations();
  }

  render() {
    return (
      <Host>
        <ftb-cup-net
          ref={el => this.initLayerEl(el)}
          stage={this.stage}
          highlightTeam={this.highlightTeam}
          highlightTeams={this.highlightTeams}
          splitSidesThreshold={this.splitSidesThreshold}
        />
      </Host>
    );
  }
}
