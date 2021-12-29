import { Component, h, Host } from '@stencil/core';
import { League, Sports } from 'ftb-models';

@Component({
  tag: 'ftb-league-logo-stories',
  styleUrl: 'ftb-league-logo.stories.scss',
  shadow: false,
})
export class FtbLeagueLogoStories {
  render() {
    return (
      <Host>
        <h1>League logo</h1>
        <ftb-league-logo league={new League({ _id: 394, name: 'AFL Moscow', sports: Sports.football })} />
        <p>Displays league logo image based on team model</p>
        <ftb-code-snippet code="<ftb-league-logo league={new League({ _id: 394, name: 'AFL Moscow', sports: Sports.football })} />" />

        <h2>Placeholder</h2>
        <p>
          When logo loading fails for some reason, placeholder icon is displayed. Icon type is selected based on league
          sports:
        </p>
        <ftb-league-logo league={new League({ _id: -1, name: 'Incorrect', sports: Sports.football })} />
        <ftb-code-snippet code="<ftb-league-logo league={new League({ _id: -1, name: 'Incorrect', sports: Sports.football })} />" />
      </Host>
    );
  }
}
