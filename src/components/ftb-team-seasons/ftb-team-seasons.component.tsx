import { Component, Host, h, Prop } from '@stencil/core';
import { Team } from 'ftb-models/dist/models/team.model';
@Component({
  tag: 'ftb-team-seasons',
  styleUrl: 'ftb-team-seasons.component.scss',
  shadow: false,
})
export class FtbTeamSeasons {
  @Prop() team!: Team;

  render() {
    return (
      <Host>
        <div class="ftb-team-seasons__wrapper">
          <div class="ftb-team-seasons__background">TEAM SEASONS</div>
        </div>
      </Host>
    );
  }
}
