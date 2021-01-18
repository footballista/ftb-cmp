import { Component, Host, h, Prop } from '@stencil/core';
import { diState, filter, Season, Team, TeamService, translations, userState } from 'ftb-models';
import { AsyncSubject } from 'rxjs';

@Component({
  tag: 'ftb-team-seasons',
  styleUrl: 'ftb-team-seasons.component.scss',
  shadow: false,
})
export class FtbTeamSeasons {
  @Prop() team!: Team;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };
  private ready$ = new AsyncSubject();

  componentWillLoad() {
    new TeamService(diState.gql).loadTeamSeasons(this.team._id).then(t => {
      this.team.seasons = t.seasons;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      const items = this.team.seasons.items;
      filtersOn = Boolean(query);
      if (!filtersOn) return items;
      await this.ready$.toPromise();
      return filter(items, query, ['name']);
    };

    return (
      <Host>
        <div class="ftb-team-seasons__wrapper">
          <div class="ftb-team-seasons__background">
            <ftb-searchable-content
              items={this.team.seasons.items}
              renderItems={items => (
                <ftb-pagination
                  totalItems={filtersOn ? items.length : this.team.seasons.total}
                  items={items}
                  renderItem={s => this.renderSeason(s)}
                  rows={this.paginationConfig.rows}
                  fixedContainerHeightPx={this.paginationConfig.fixedContainerHeightPx}
                  itemMinWidthPx={this.paginationConfig.itemMinWidthPx}
                  itemMinHeightPx={this.paginationConfig.itemMinHeightPx}
                  stretchX={this.paginationConfig.stretchX}
                  stretchY={this.paginationConfig.stretchY}
                  XtoY={this.paginationConfig.XtoY}
                ></ftb-pagination>
              )}
              filterFn={filterFn}
              placeholder={translations.champ.search_by_champ_name[userState.language]}
              categories={[]}
            ></ftb-searchable-content>
          </div>
        </div>
      </Host>
    );
  }

  private renderSeason(s: Season) {
    return (
      <ftb-link route="season" params={{ seasonId: s._id, tournamentName: s.champ.name + ' - ' + s.name }}>
        {s.name}
      </ftb-link>
    );
  }
}
