import { Component, h, Host, State } from '@stencil/core';
import { CategoryInterface } from '@src/components/ftb-searchable-content/ftb-searchable-content.component';
import { City, filter, League, translations, userState, diState, envState, LeagueService } from 'ftb-models';

import {
  GlobalSearchResult,
  isGlobalSearchResultChamp,
  isGlobalSearchResultLeague,
  isGlobalSearchResultPerson,
  isGlobalSearchResultPlayer,
  isGlobalSearchResultStadium,
  isGlobalSearchResultTeam,
} from 'ftb-models/dist/models/global-search-result.model';
import uniqBy from 'lodash-es/uniqBy';

import { GlobalSearchService } from 'ftb-models/dist/services/global-search.service';
import { getFromStorage, setToStorage } from '../../../../ftb-models/src/tools/storage';
const LS_RESULTS_KEY = 'ftb::searchResults';

@Component({
  tag: 'ftb-global-search',
  styleUrl: 'ftb-global-search.component.scss',
  shadow: false,
})
export class FtbGlobalSearch {
  @State() leagues: League[];
  @State() filtersOn = false;
  @State() searchInProgress = false;
  @State() focusedIdx = -1;
  @State() results: GlobalSearchResult[] = [];
  @State() savedResults = [];
  @State() inputFocused = false;
  @State() clearSignal = 0;
  @State() categories: CategoryInterface[] = [];
  private resultsElements = [];
  private abortHttpController: AbortController;

  async componentWillLoad() {
    this.savedResults = (await getFromStorage(LS_RESULTS_KEY)) || [];
    this.leagues = await new LeagueService(diState.gql).loadLeagues();
  }

  render() {
    const getCategories = (currentCategories?: CategoryInterface[]) => {
      const cityId = currentCategories?.find(c => c.key === 'city')?.options.find(o => o.selected)?._id;
      const leagueId = currentCategories?.find(c => c.key === 'league')?.options.find(o => o.selected)?._id;

      const categories = [];

      const leaguesMap = {};
      (cityId ? this.leagues.filter(l => l.city._id === cityId) : this.leagues).forEach(l => {
        leaguesMap[l._id] ??= l;
      });

      categories.push({
        key: 'league',
        lsKey: 'ftb::global-search::league',
        placeholder: translations.search.search[userState.language],
        filterFn: (query, options) => filter(options, query, ['name']),
        renderItem: l => (
          <div class="league-option">
            {l._id && <ftb-league-logo league={l} key={l._id}></ftb-league-logo>}
            {l.name}
          </div>
        ),
        options: [
          { name: translations.global_search.all_leagues[userState.language] },
          ...Object.values(leaguesMap).map((l: League) => Object.assign(l, { selected: l._id === leagueId })),
        ],
      });

      const citiesMap = {};
      this.leagues.forEach(l => {
        citiesMap[l.city._id] ??= l.city;
      });

      categories.push({
        key: 'city',
        lsKey: 'ftb::global-search::city',
        placeholder: translations.search.search[userState.language],
        filterFn: (query, options) => filter(options, query, ['name']),
        renderItem: c => (
          <div class="city-option">
            {c.flag && <ftb-flag flag={c.flag} key={c.flag}></ftb-flag>} {c.name}
          </div>
        ),
        options: [
          { name: translations.global_search.all_cities[userState.language] },
          ...Object.values(citiesMap).map((c: City) => Object.assign(c, { selected: c._id === cityId })),
        ],
      });

      this.categories = categories;
      return categories;
    };

    return (
      <Host>
        <div class="ftb-global-search__wrapper">
          <div class="ftb-global-search__background">
            <ftb-searchable-content
              items={[]}
              filterFn={(_, q, c) => this.search(q, c)}
              placeholder={translations.global_search.global_search[userState.language]}
              getCategories={cc => getCategories(cc)}
              renderItems={i => this.renderResults(i)}
              onInputKeyDown={e => this.onInputKeyDown(e.detail)}
              onInputFocusChange={e => (this.inputFocused = e.detail)}
              clear={this.clearSignal}
            ></ftb-searchable-content>
          </div>
        </div>
      </Host>
    );
  }

  private onInputKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      if (this.focusedIdx + 1 < this.results.length) {
        this.focusedIdx++;
      }
    } else if (e.key === 'ArrowUp') {
      if (this.focusedIdx > 0) {
        this.focusedIdx--;
      }
    } else if (e.key === 'Enter') {
      if (this.focusedIdx > -1) {
        this.resultsElements[this.focusedIdx].click();
      }
    } else {
      this.inputFocused = true;
    }
  }

  private async search(query: string, categories: CategoryInterface[]) {
    if (this.abortHttpController) this.abortHttpController.abort();
    const cityId = categories?.find(c => c.key === 'city')?.options.find(o => o.selected)?._id;
    const leagueId = categories?.find(c => c.key === 'league')?.options.find(o => o.selected)?._id;
    this.filtersOn = Boolean(query);
    if (!this.filtersOn) return (this.results = []);
    this.searchInProgress = true;
    this.abortHttpController = new AbortController();
    this.results = await new GlobalSearchService(diState.http, envState.apiHost).search(
      query,
      leagueId,
      cityId,
      this.abortHttpController.signal,
    );
    this.searchInProgress = false;
    return this.results;
  }

  private async onItemClick(idx) {
    this.filtersOn = false;
    const r = this.results[idx];
    let savedResults = (await getFromStorage(LS_RESULTS_KEY)) || [];
    savedResults = savedResults.filter(row => row.type != r.type || row.item._id != r.item._id).slice(0, 4);
    savedResults.unshift(r);
    console.log(savedResults);
    await setToStorage(LS_RESULTS_KEY, savedResults);
    this.savedResults = savedResults;
    this.focusedIdx = -1;
    this.inputFocused = false;
    this.clearSignal++;
  }

  private renderResults(results: any[]) {
    if (this.searchInProgress) return null;
    if (!this.inputFocused) return null;

    if (!this.filtersOn) {
      const cityId = this.categories?.find(c => c.key === 'city')?.options.find(o => o.selected)?._id;
      const leagueId = this.categories?.find(c => c.key === 'league')?.options.find(o => o.selected)?._id;
      this.results = this.savedResults
        .filter(r => (cityId ? r.item.league.city._id == cityId : true))
        .filter(r => (leagueId ? r.item.league._id == leagueId : true));
      results = this.results;
      if (!results.length) return null;
    }

    this.resultsElements = [];

    return (
      <div class="ftb-global-search__results-wrapper">
        <div class="ftb-global-search__results">
          {results.length ? (
            results.map((row, idx) => (
              <div
                class={{ 'ftb-global-search__item-wrapper': true, 'focused': this.focusedIdx == idx }}
                onMouseDown={() => this.onItemClick(idx)}
                onClick={() => this.onItemClick(idx)}
                ref={el => (this.resultsElements[idx] = el)}
              >
                {this.renderRow(row)}
              </div>
            ))
          ) : (
            <div class="ftb-global-search__item no-results">
              {translations.search.nothing_found[userState.language]}
            </div>
          )}
        </div>
      </div>
    );
  }

  private renderRow(row: GlobalSearchResult) {
    if (isGlobalSearchResultTeam(row)) {
      return (
        <div class="ftb-global-search__item team">
          <ftb-team-logo team={row.item} key={row.item._id}></ftb-team-logo>
          <div class="info">
            <div class="name">{row.item.name}</div>
            <div class="league">{row.item.league.name}</div>
          </div>
        </div>
      );
    } else if (isGlobalSearchResultPlayer(row)) {
      return (
        <div class="ftb-global-search__item player">
          <ftb-player-photo player={row.item} key={row.item._id}></ftb-player-photo>
          <div class="info">
            <div class="name">
              {row.item.firstName} {row.item.middleName} {row.item.lastName}
            </div>
            <div class="league">{row.item.league.name}</div>
          </div>
        </div>
      );
    } else if (isGlobalSearchResultChamp(row)) {
      return (
        <div class="ftb-global-search__item champ">
          <ftb-flag flag={row.item.country.flag} key={row.item._id}></ftb-flag>
          <div class="info">
            <div class="name">{row.item.name}</div>
            <div class="league">{row.item.league.name}</div>
          </div>
        </div>
      );
    } else if (isGlobalSearchResultLeague(row)) {
      return (
        <div class="ftb-global-search__item league">
          <ftb-league-logo league={row.item} key={row.item._id}></ftb-league-logo>
          <div class="info">
            <div class="name">{row.item.name}</div>
          </div>
        </div>
      );
    } else if (isGlobalSearchResultPerson(row)) {
      return (
        <div class="ftb-global-search__item person">
          <ftb-user-photo user={row.item} key={row.item._id}></ftb-user-photo>
          <div class="info">
            <div class="name">{row.item.name}</div>
            <div class="league">
              {uniqBy(row.item.roles, 'level')
                .map(r => translations.role[r.level][userState.language])
                .join(', ')}
              , {row.item.league.name}
            </div>
          </div>
        </div>
      );
    } else if (isGlobalSearchResultStadium(row)) {
      return (
        <div class="ftb-global-search__item stadium">
          <ftb-stadium-photo stadium={row.item} key={row.item._id}></ftb-stadium-photo>
          <div class="info">
            <div class="name">{row.item.name}</div>
            <div class="league">{row.item.league.name}</div>
          </div>
        </div>
      );
    }
  }
}
