import { Component, h, Prop } from '@stencil/core';
import { League, Sports } from 'ftb-models';
import BasketballIcon from '../../assets/icons/basketball-filled.svg';
import FootballIcon from '../../assets/icons/football-filled.svg';
import VolleyballIcon from '../../assets/icons/volleyball-filled.svg';

@Component({
  tag: 'ftb-league-sports-icon',
  styleUrl: 'ftb-league-sports-icon.component.scss',
  shadow: false,
})
export class FtbLeagueSportsIcon {
  @Prop() league!: League;

  render() {
    let svg = '';
    if (this.league.sports == Sports.basketball) {
      svg = BasketballIcon;
    } else if (this.league.sports == Sports.volleyball) {
      svg = VolleyballIcon;
    } else {
      // todo add other sports icons
      svg = FootballIcon;
    }

    return <ftb-icon svg={svg} />;
  }
}
