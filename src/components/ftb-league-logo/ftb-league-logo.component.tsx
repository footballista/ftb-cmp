import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import { League, envState } from 'ftb-models';

@Component({
  tag: 'ftb-league-logo',
  styleUrl: 'ftb-league-logo.component.scss',
  shadow: false,
})
export class FtbLeagueLogo {
  @Prop() league!: League;
  @State() showPlaceholder: boolean = false;

  @Element() el: HTMLFtbLeagueLogoElement;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  render() {
    if (!this.league) return null;

    const url = envState.imgHost + `/img/leagues/${this.league._id}.png?version=${this.league.logoId}`;

    return (
      <Host class="loading">
        {this.showPlaceholder ? (
          <ftb-league-sports-icon league={this.league} />
        ) : (
          <img
            src={url}
            onError={e => {
              this.onImgFail(e.target as HTMLImageElement);
              this.el.classList.remove('loading');
            }}
            onLoad={() => {
              this.el.classList.remove('loading');
            }}
            alt={this.league.name}
            title={this.league.name}
          />
        )}
      </Host>
    );
  }
}
