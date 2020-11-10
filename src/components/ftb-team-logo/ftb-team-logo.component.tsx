import { Component, h, Host, Prop, State } from '@stencil/core';
import { Team } from 'ftb-models/dist/models/team.model';
import { FtbTeamLogoMode } from './ftb-team-logo-mode';
import Shield from '../../assets/icons/shield.svg';

@Component({
  tag: 'ftb-team-logo',
  styleUrl: 'ftb-team-logo.component.scss',
  shadow: false,
})
export class FtbTeamLogo {
  @Prop() mode: FtbTeamLogoMode = FtbTeamLogoMode.min;
  @Prop() team: Team; // pass team model or separate properties below ↙
  @Prop() logo: string;
  @Prop() name: string;
  @Prop() version: number;
  @State() showPlaceholder: boolean = false;
  private url: string;

  componentWillLoad() {
    this.url = `https://footballista.ru/api/img/logos/${this.logo}-${this.mode}.png?logoId=${this.version}`;
  }

  render() {
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={Shield}></ftb-icon>
        ) : (
          <ftb-img src={this.url} onFailed={() => (this.showPlaceholder = true)}></ftb-img>
        )}
      </Host>
    );
  }
}
