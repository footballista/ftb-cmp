import { Component, h, Host } from '@stencil/core';
import { League, Sports } from 'ftb-models';

@Component({
  tag: 'ftb-league-sports-icon-stories',
  styleUrl: 'ftb-league-sports-icon.stories.scss',
  shadow: false,
})
export class FtbLeagueSportsIconStories {
  render() {
    return (
      <Host>
        <h1>League sports icon</h1>
        <ftb-league-sports-icon league={new League({ sports: Sports.football })} />
        <ftb-league-sports-icon league={new League({ sports: Sports.basketball })} />
        <ftb-league-sports-icon league={new League({ sports: Sports.volleyball })} />

        <p>Displays league sports icon based on league model</p>
        <ftb-code-snippet code=" <ftb-league-sports-icon league={new League({sports: Sports.football})}/>" />
      </Host>
    );
  }
}
