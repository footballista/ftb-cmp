import { Component, Prop, Host, h, Element } from '@stencil/core';
import { Stage, Team } from 'ftb-models';
import ExpandIcon from '../../assets/icons/expand.svg';

@Component({
  tag: 'ftb-cup-net-explorer',
  styleUrl: 'ftb-cup-net-explorer.component.scss',
  shadow: false,
})
export class FtbCupNetExplorer {
  @Prop() stage!: Stage;
  @Prop() highlightTeam?: Team;
  @Prop() splitSidesThreshold?: number;
  @Element() el: HTMLElement;
  modalEl: HTMLFtbCupNetModalElement;

  componentDidLoad() {
    this.createModal();
  }

  createModal() {
    this.modalEl = document.createElement('ftb-cup-net-modal');
    Object.assign(this.modalEl, {
      stage: this.stage,
      highlightTeam: this.highlightTeam,
      splitSidesThreshold: this.splitSidesThreshold,
    });
    this.modalEl.addEventListener('closed', () => {
      this.createModal();
    });
  }

  disconnectedCallback() {
    this.modalEl = null;
  }

  async openFullScreen() {
    const { left, top, height, width } = this.el.getBoundingClientRect();
    this.modalEl.style.left = left + 'px';
    this.modalEl.style.top = top + 'px';
    this.modalEl.style.height = height + 'px';
    this.modalEl.style.width = width + 'px';
    document.body.appendChild(this.modalEl);
    this.modalEl.open();
  }

  render() {
    return (
      <Host>
        <ftb-cup-net-explorer-img-layer
          stage={this.stage}
          highlightTeam={this.highlightTeam}
          splitSidesThreshold={this.splitSidesThreshold}
        />
        <button class="zoom-button" onClick={() => this.openFullScreen()}>
          <ftb-icon svg={ExpandIcon} />
        </button>
      </Host>
    );
  }
}
