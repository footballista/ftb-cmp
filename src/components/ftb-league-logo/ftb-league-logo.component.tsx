import { Component, Host, h, Prop, State } from '@stencil/core';
import { League } from 'ftb-models';
import Trophy from '../../assets/icons/trophy.svg';
import { envStore } from '@src/tools/env.store';
@Component({
  tag: 'ftb-league-logo',
  styleUrl: 'ftb-league-logo.component.scss',
  shadow: false,
})
export class FtbLeagueLogo {
  @Prop() league!: League;
  @Prop() caption: string;
  @State() url: string;
  @State() showPlaceholder: boolean = false;

  componentWillLoad() {
    this.url = envStore.imgHost + `/img/leagues/${this.league._id}.png?version=${this.league.logoId}`;
  }

  onImgFail() {
    this.showPlaceholder = true;
  }

  render() {
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={Trophy} title={this.caption || this.league.name}></ftb-icon>
        ) : (
          <ftb-img src={this.url} onFailed={() => this.onImgFail()} title={this.caption || this.league.name}></ftb-img>
        )}
      </Host>
    );
  }
}
