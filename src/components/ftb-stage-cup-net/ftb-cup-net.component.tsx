import { Component, Host, h, Prop } from '@stencil/core';
import { Stage, Team } from 'ftb-models';

@Component({
  tag: 'ftb-cup-net',
  styleUrl: 'ftb-cup-net.component.scss',
  shadow: false,
})
export class FtbStageCupNet {
  @Prop() stage: Stage;
  @Prop() highlightTeam?: Team;

  render() {
    // todo add quadratic and ternary split
    return (
      <Host>
        <ftb-cup-net-quadratic stage={this.stage} highlightTeam={this.highlightTeam} />
      </Host>
    );
  }
}
