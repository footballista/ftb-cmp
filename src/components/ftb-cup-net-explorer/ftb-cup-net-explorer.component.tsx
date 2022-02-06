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
  @Prop() highlightTeams?: Team[];
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
      highlightTeams: this.highlightTeams,
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
    this.modalEl.children[1]['style'].left = left + 'px';
    this.modalEl.children[1]['style'].top = top + 'px';
    this.modalEl.children[1]['style'].height = height + 'px';
    this.modalEl.children[1]['style'].width = width + 'px';
    document.body.appendChild(this.modalEl);
    this.modalEl.open();
  }

  render() {
    return (
      <Host>
        <ftb-cup-net-explorer-img-layer
          onMouseDown={() => this.openFullScreen()}
          stage={this.stage}
          highlightTeam={this.highlightTeam}
          highlightTeams={this.highlightTeams}
          splitSidesThreshold={this.splitSidesThreshold}
          disabled={true}
        />
        <button class="zoom-button" onClick={() => this.openFullScreen()}>
          <ftb-icon svg={ExpandIcon} />
        </button>
      </Host>
    );
  }
}
