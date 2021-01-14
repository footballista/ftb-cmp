import { Component, Host, h, Prop, State } from '@stencil/core';
import { filter, translations, Player, PlayerService, userState, diState } from 'ftb-models';

@Component({
  tag: 'ftb-player-career',
  styleUrl: 'ftb-player-career.component.scss',
  shadow: false,
})
export class FtbPlayerCareer {
  @Prop() player!: Player;
  @State() loaded = false;

  componentWillLoad() {
    new PlayerService(diState.gql).loadPlayerCareer(this.player._id).then(p => {
      this.player.career = p.career;
      this.loaded = true;
    });
  }

  render() {
    const tabs = [
      {
        renderTitle: () => translations.team.teams[userState.language],
        renderContent: () => (this.player.career?.teams ? this.renderTeams() : this.renderSpinner()),
      },
      {
        renderTitle: () => translations.champ.champs[userState.language],
        renderContent: () => (this.player.career?.seasons ? this.renderChamps() : this.renderSpinner()),
      },
    ];

    return (
      <Host>
        <div class="ftb-player-career__wrapper">
          <div class="ftb-player-career__background">
            <ftb-tabs tabs={tabs}></ftb-tabs>
          </div>
        </div>
      </Host>
    );
  }

  private renderSpinner() {
    return (
      <div class="ftb-player-career__spinner-wrapper">
        <ftb-spinner></ftb-spinner>
      </div>
    );
  }

  private renderTeams() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      let items = this.player.career.teams;
      filtersOn = Boolean(query);
      if (!filtersOn) return items;
      return filter(items, query, ['team.name', 'team.shortName', 'team.name', 'team.shortName']);
    };

    return (
      <ftb-searchable-content
        key="player-career-teams"
        items={this.player.career.teams}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.player.career.teams.length}
            items={items}
            renderItem={d => <ftb-player-team-card data={d} key={d.team._id}></ftb-player-team-card>}
            rows={1}
            itemMinWidthPx={265.5}
            itemHeightPx={60}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.team.search_by_team_name[userState.language]}
        categories={[]}
      ></ftb-searchable-content>
    );
  }

  private renderChamps() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      let items = this.player.career.seasons;
      filtersOn = Boolean(query);
      if (!filtersOn) return items;
      return filter(items, query, ['champ.name', 'name']);
    };

    return (
      <ftb-searchable-content
        key="player-career-seasons"
        items={this.player.career.seasons}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.player.career.seasons.length}
            items={items}
            renderItem={d => <ftb-player-season-card data={d} key={d.season._id}></ftb-player-season-card>}
            rows={1}
            itemMinWidthPx={265.5}
            itemHeightPx={60}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.champ.search_by_champ_name[userState.language]}
        categories={[]}
      ></ftb-searchable-content>
    );
  }
}
