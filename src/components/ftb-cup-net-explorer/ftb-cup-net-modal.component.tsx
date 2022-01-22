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

  @Method() async open() {
    this.el.style.transition = 'all 0.3s ease-in-out';
    window.addEventListener('keydown', this.onKeyPress);
    setTimeout(() => this.el.classList.add('open'), 0);
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
    this.el.classList.remove('open');
    setTimeout(() => {
      this.el.remove();
      this.closed.emit(true);
    }, 280);
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
