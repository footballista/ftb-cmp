import { Component, Host, h, Prop } from '@stencil/core';
import { filter, League, Stadium, translations, LeagueService, userState } from 'ftb-models';
import { AsyncSubject } from 'rxjs';

@Component({
  tag: 'ftb-league-stadiums',
  styleUrl: 'ftb-league-stadiums.component.scss',
  shadow: false,
})
export class FtbLeagueStadiums {
  @Prop() league!: League;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };

  private ready$ = new AsyncSubject<boolean>();

  componentWillLoad() {
    new LeagueService().loadLeagueStadiums(this.league._id).then(l => {
      this.league.stadiums = l.stadiums;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    if (!this.league.stadiums.total) return null;
    return (
      <Host>
        <div class="ftb-league-stadiums__wrapper">
          <div class="ftb-league-stadiums__background">
            <h2 class="component-header">{translations.stadium.stadiums[userState.language]}</h2>
            <div class="ftb-league-stadiums__content">{this.renderStadiumsList()}</div>
          </div>
        </div>
      </Host>
    );
  }

  private renderStadiumsList() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      await this.ready$.toPromise();
      filtersOn = Boolean(query);
      return filter(this.league.stadiums.items, query, ['name']);
    };

    return (
      <ftb-searchable-content
        items={this.league.stadiums.items}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.league.stadiums.total}
            items={items}
            renderItem={(s: Stadium) => <ftb-stadium-card stadium={s} key={'stadium' + s._id}></ftb-stadium-card>}
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
        placeholder={translations.stadium.search_by_stadium_name[userState.language]}
        categories={[]}
      ></ftb-searchable-content>
    );
  }
}
