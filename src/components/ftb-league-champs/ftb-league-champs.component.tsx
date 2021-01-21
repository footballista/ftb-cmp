import { Component, Host, h, Prop } from '@stencil/core';
import { Champ, League, translations, filter, userState } from 'ftb-models';
import sortBy from 'lodash-es/sortBy';
import { CategoryInterface } from '../ftb-searchable-content/ftb-searchable-content.component';

@Component({
  tag: 'ftb-league-champs',
  styleUrl: 'ftb-league-champs.component.scss',
  shadow: false,
})
export class FtbLeagueChamps {
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

  componentWillLoad() {
    this.league.champs = sortBy(this.league.champs, ['country.sortIdx']);
  }

  render() {
    return (
      <Host>
        <div class="ftb-league-champs__wrapper">
          <div class="ftb-league-champs__background">
            <h2 class="component-header">{translations.champ.champs[userState.language]}</h2>
            <div class="ftb-league-champs__content">{this.renderChampsList()}</div>
          </div>
        </div>
      </Host>
    );
  }

  private renderChampsList() {
    let filtersOn = false;
    const filterFn = async (_, query: string, categories: CategoryInterface[]) => {
      const countryId = categories.find(c => c.key === 'countryId').options.find(o => o.selected).key;
      filtersOn = query || countryId;
      if (!filtersOn) return countryId;
      const champs =
        countryId === 'all' ? this.league.champs : this.league.champs.filter(c => c.country._id == countryId);
      return filter(champs, query, ['name']);
    };

    return (
      <ftb-searchable-content
        items={this.league.champs}
        renderItems={(items: Champ[]) => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.league.champs.length}
            items={items}
            renderItem={(c: Champ) => <ftb-champ-card champ={c} key={c._id}></ftb-champ-card>}
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
        categories={[
          {
            key: 'countryId',
            lsKey: 'ftb::league-champs::leagueId',
            placeholder: translations.search.search[userState.language],
            filterFn: (query, options) => filter(options, query, ['text']),
            options: [
              { key: 'all', text: translations.champ.all_countries[userState.language] },
              ...this.league.countries.map(c => ({ key: c._id, text: c.name, flag: c.flag })),
            ],
            renderItem: c => (
              <div class="country-option">
                {c.flag && <ftb-flag flag={c.flag} key={c.flag}></ftb-flag>}
                {c.text}
              </div>
            ),
          },
        ]}
      ></ftb-searchable-content>
    );
  }
}
