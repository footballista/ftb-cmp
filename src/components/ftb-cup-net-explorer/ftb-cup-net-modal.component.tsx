import { Component, Prop, Host, h, Element, Method, Event, EventEmitter } from '@stencil/core';
import { Stage, Team } from 'ftb-models';
import ExpandIcon from '../../assets/icons/expand.svg';

@Component({
  tag: 'ftb-cup-net-modal',
  styleUrl: 'ftb-cup-net-modal.component.scss',
  shadow: false,
})
export class FtbCupNetModal {
  @Prop() stage!: Stage;
  @Prop() highlightTeam?: Team;
  @Prop() splitSidesThreshold?: number;
  @Event() closed: EventEmitter<boolean>;
  @Element() el: HTMLElement;

  initialMeasures: {
    height: number;
    width: number;
    top: number;
    left: number;
  };

  @Method() async open() {
    this.el.style.transition = 'all 0.3s ease-in-out';
    window.addEventListener('keydown', this.onKeyPress);
    setTimeout(() => {
      const { height: netHeight, width: netWidth } = this.el
        .querySelector('ftb-cup-net-explorer-img-layer ftb-cup-net')
        .getBoundingClientRect();

      const {
        height: initialHeight,
        width: initialWidth,
        top: initialTop,
        left: initialLeft,
      } = this.el.getBoundingClientRect();
      this.initialMeasures = {
        height: initialHeight,
        width: initialWidth,
        top: initialTop,
        left: initialLeft,
      };

      const SAFETY_PADDING = 40;
      const { innerHeight: windowHeight, innerWidth: windowWidth } = window;
      const modalWidth = Math.min(windowWidth * 0.9, netWidth + SAFETY_PADDING);
      const modalHeight = Math.min(windowHeight * 0.9, netHeight + SAFETY_PADDING);
      this.el.style.height = modalHeight + 'px';
      this.el.style.width = modalWidth + 'px';
      this.el.style.top = (windowHeight - modalHeight) / 2 + 'px';
      this.el.style.left = (windowWidth - modalWidth) / 2 + 'px';
    }, 0);
  }

  constructor() {
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.onKeyPress);
  }

  onKeyPress(e: KeyboardEvent) {
    if (e.key == 'Escape') {
      this.close();
    }
  }

  close() {
    this.el.style.height = this.initialMeasures.height + 'px';
    this.el.style.width = this.initialMeasures.width + 'px';
    this.el.style.top = this.initialMeasures.top + 'px';
    this.el.style.left = this.initialMeasures.left + 'px';
    setTimeout(() => {
      this.el.remove();
      this.closed.emit(true);
    }, 300);
  }

  render() {
    return (
      <Host>
        <ftb-cup-net-explorer-img-layer
          stage={this.stage}
          highlightTeam={this.highlightTeam}
          splitSidesThreshold={this.splitSidesThreshold}
        />
        <button class="zoom-button" onClick={() => this.close()}>
          <ftb-icon svg={ExpandIcon} />
        </button>
      </Host>
    );
  }
}
