import { Component, Host, h, Method, Element, Event, EventEmitter } from '@stencil/core';

// import { Component, Prop, Host, h, Element, Method, Event, EventEmitter } from '@stencil/core';
// import { Stage, Team } from 'ftb-models';
// import CollapseIcon from '../../assets/icons/collapse.svg';

@Component({
  tag: 'ftb-cup-net-modal',
  styleUrl: 'ftb-cup-net-modal.component.scss',
  shadow: false,
})
export class FtbCupNetModal {
  // @Prop() stage!: Stage;
  // @Prop() highlightTeam?: Team;
  // @Prop() highlightTeams?: Team[];
  // @Prop() splitSidesThreshold?: number;
  @Event() closed: EventEmitter<HTMLElement>;
  @Element() el: HTMLElement;
  netEl: HTMLElement;

  initialMeasures: {
    height: number;
    width: number;
    top: number;
    left: number;
  };

  constructor() {
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  @Method() async open(netEl: HTMLElement) {
    window.addEventListener('keydown', this.onKeyDown);
    this.el.classList.add('open');

    // const el = netEl.firstChild.cloneNode();
    // const { stage, highlightTeam, highlightTeams, splitSidesThreshold } =
    //   netEl.firstChild as HTMLFtbCupNetExplorerImgLayerElement;
    // Object.assign(el, { stage, highlightTeam, highlightTeams, splitSidesThreshold });
    // this.netEl = document.createElement('div');
    // this.netEl.classList.add('net-wrapper');
    // this.netEl.append(el);
    // this.el.append(this.netEl);
    // console.log(this.netEl);
    this.netEl = document.createElement('div');
    this.netEl.classList.add('net-wrapper');
    const { top, left, height, width } = netEl.getBoundingClientRect();

    this.netEl.style.top = top + 'px';
    this.netEl.style.left = left + 'px';
    this.netEl.style.width = width + 'px';
    this.netEl.style.height = height + 'px';
    this.initialMeasures = { height, width, top, left };

    const imgLayerEl = document.createElement('ftb-cup-net-explorer-img-layer');
    const { stage, highlightTeam, highlightTeams, splitSidesThreshold } =
      netEl.firstChild as HTMLFtbCupNetExplorerImgLayerElement;
    Object.assign(imgLayerEl, { stage, highlightTeam, highlightTeams, splitSidesThreshold });
    this.netEl.append(imgLayerEl);
    imgLayerEl.style.opacity = '0';
    this.el.appendChild(this.netEl);

    this.netEl.style.transition = 'all 0.3s ease-in-out';
    setTimeout(() => {
      imgLayerEl.style.opacity = '1';
      const { height: netHeight, width: netWidth } = this.netEl.querySelector('ftb-cup-net').getBoundingClientRect();

      const SAFETY_PADDING = 40;
      const { innerHeight: windowHeight, innerWidth: windowWidth } = window;
      const modalWidth = Math.min(windowWidth * 0.9, netWidth + SAFETY_PADDING);
      const modalHeight = Math.min(windowHeight * 0.9, netHeight + SAFETY_PADDING);

      this.netEl.style.top = (windowHeight - modalHeight) / 2 + 'px';
      this.netEl.style.left = (windowWidth - modalWidth) / 2 + 'px';
      this.netEl.style.height = modalHeight + 'px';
      this.netEl.style.width = modalWidth + 'px';
    }, 50);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key == 'Escape') {
      this.close();
    }
  }

  onBackdropClick(e: MouseEvent) {
    if (e.target['className'] == 'backdrop') {
      //clicking on backdrop, not content
      this.close();
    }
  }

  close() {
    this.el.classList.remove('open');
    this.netEl.style.height = this.initialMeasures.height + 'px';
    this.netEl.style.width = this.initialMeasures.width + 'px';
    this.netEl.style.top = this.initialMeasures.top + 'px';
    this.netEl.style.left = this.initialMeasures.left + 'px';
    setTimeout(() => {
      this.el.remove();
      this.closed.emit(this.netEl);
    }, 300);
  }

  render() {
    return (
      <Host>
        <div onClick={e => this.onBackdropClick(e)} class="backdrop" />
      </Host>
    );
  }
}
