import { Component, Host, h, Prop, Element } from '@stencil/core';
import { Stage, Team } from 'ftb-models';
// import { Component, Prop, Host, h, Element } from '@stencil/core';
// import ExpandIcon from '../../assets/icons/expand.svg';

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
  modalOpen: boolean;
  @Element() el: HTMLElement;
  modalEl: HTMLFtbCupNetModalElement;
  netWrapperEl: HTMLElement;

  componentDidLoad() {
    this.createModal();
  }

  createModal() {
    this.modalEl = document.createElement('ftb-cup-net-modal');
    window.document.body.appendChild(this.modalEl);

    // this.modalEl = document.createElement('ftb-cup-net-modal');
    // Object.assign(this.modalEl, {
    //   stage: this.stage,
    //   highlightTeam: this.highlightTeam,
    //   highlightTeams: this.highlightTeams,
    //   splitSidesThreshold: this.splitSidesThreshold,
    // });
    // console.log(this.modalEl);
    this.modalEl.addEventListener('closed', () => {
      this.modalOpen = false;
      this.createModal();
    });
  }

  disconnectedCallback() {
    this.modalEl.remove();
    this.modalEl = null;
  }

  async openFullScreen() {
    // this.modalEl.open(this.imgLayerEl);
    // document.body.appendChild(this.modalEl);
    // const { left, top, height, width } = this.el.getBoundingClientRect();
    // this.modalEl.children[1]['style'].left = left + 'px';
    // this.modalEl.children[1]['style'].top = top + 'px';
    // this.modalEl.children[1]['style'].height = height + 'px';
    // this.modalEl.children[1]['style'].width = width + 'px';
    // document.body.appendChild(this.modalEl);
    // this.modalEl.open();
  }

  onHostClick() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalEl.open(this.netWrapperEl);
    }
  }

  render() {
    return (
      <Host onClick={() => this.onHostClick()}>
        <div class="net-wrapper" ref={el => (this.netWrapperEl = el)}>
          <ftb-cup-net-explorer-img-layer
            stage={this.stage}
            highlightTeam={this.highlightTeam}
            highlightTeams={this.highlightTeams}
            splitSidesThreshold={this.splitSidesThreshold}
            disabled={true}
          />
        </div>

        {/*<button class="zoom-button" onClick={() => this.openFullScreen()}>*/}
        {/*  <ftb-icon svg={ExpandIcon} />*/}
        {/*</button>*/}
      </Host>
    );
  }
}
