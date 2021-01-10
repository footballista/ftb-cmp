import { Component, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';
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
  @Prop() caption: string;
  @Event() color: EventEmitter<[number, number, number][]>;
  @State() showPlaceholder: boolean = false;
  @State() url: string;
  private isDestroyed: boolean;

  componentWillLoad() {
    if (!this.team) {
      this.team = new Team({ logo: this.logo, name: this.name, logoId: this.version });
    }

    this.url = `https://footballista.ru/api/img/logos/${this.team.logo}-${this.mode}.png?logoId=${this.team.logoId}`;
  }

  onImgFail() {
    if (this.isDestroyed) return;
    this.showPlaceholder = true;
    this.color.emit([
      [0, 0, 0],
      [255, 255, 255],
      [0, 0, 100],
    ]);
  }

  disconnectedCallback() {
    this.isDestroyed = true;
  }

  render() {
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={Shield} title={this.team.name}></ftb-icon>
        ) : (
          <ftb-img
            src={this.url}
            onFailed={() => this.onImgFail()}
            onColor={e => !this.isDestroyed && this.color.emit(e.detail)}
            title={this.caption || this.team.name}
          ></ftb-img>
        )}
      </Host>
    );
  }
}
