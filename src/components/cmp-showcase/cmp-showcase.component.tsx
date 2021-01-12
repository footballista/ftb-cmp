import { Component, Host, h, State } from '@stencil/core';
import { Team } from 'ftb-models/dist/models/team.model';
import { User } from 'ftb-models/dist/models/user.model';
import { Player } from 'ftb-models/dist/models/player.model';
import range from 'lodash-es/range';
import { Collection } from 'ftb-models/dist/models/base/collection';
import { CategoryInterface } from '@src/components/ftb-searchable-content/ftb-searchable-content.component';
import { BannerSlotCode, Champ, filter, Game, GamePhoto, GamePhotoImg, League, Season, Stadium } from 'ftb-models';
import { GraphqlClient } from 'ftb-models/dist/tools/clients/graphql.client';
import { HttpClient } from 'ftb-models/dist/tools/clients/http.client';
import { GameService } from 'ftb-models/dist/services/game.service';
import { FtbGameCardField } from '@src/components/ftb-game-card/ftb-game-card-fields';
import { LeagueService } from 'ftb-models/dist/services/league.service';
import { SeasonService } from 'ftb-models/dist/services/season.service';
import { TeamService } from 'ftb-models/dist/services/team.service';
import { StadiumService } from 'ftb-models/dist/services/stadium.service';
import { PersonService } from 'ftb-models/dist/services/person.service';
import { PlayerService } from 'ftb-models/dist/services/player.service';

/**
 * Test page that demonstrates all existing components
 */
@Component({
  tag: 'cmp-showcase',
  styleUrl: 'cmp-showcase.component.scss',
  shadow: true,
})
export class CmpTest {
  @State() updateSignal = 0;

  private data = {
    improvingCollection: new Collection({ total: 12, items: range(7) }),
    // game: new Game({ _id: 347476 }),
    game: new Game({ _id: 313283 }),
    league: new League({ _id: 394 }),
    champ: new Champ({ _id: 2117 }),
    // season: new Season({ _id: 4205 }),
    season: new Season({ _id: 4270 }),
    team: new Team({ _id: 18804 }),
    person: new User({ _id: 750 }),
    stadium: new Stadium({ _id: 1086 }),
    player: new Player({ _id: 453593 }),
    showGallery: false,
    galleryIdx: 0,
  };

  async componentWillLoad() {
    const gql = new GraphqlClient(new HttpClient('AFL_RU', new User()), 'http://localhost:3004/graphql/');
    await Promise.all([
      (async () => (this.data.game = await new GameService(gql).loadFullGameInfo(this.data.game._id)))(),
      (async () => (this.data.league = await new LeagueService(gql).loadLeagueInfo(this.data.league._id)))(),
      (async () => (this.data.season = await new SeasonService(gql).loadSeasonStandings(this.data.season._id)))(),
      (async () => (this.data.team = await new TeamService(gql).loadTeamInfo(this.data.team._id)))(),
      (async () => (this.data.stadium = await new StadiumService(gql).loadStadiumGames(this.data.stadium._id)))(),
      (async () => (this.data.person = await new PersonService(gql).loadPersonInfo(this.data.person._id)))(),
      (async () => (this.data.player = await new PlayerService(gql).loadPlayerInfo(this.data.player._id)))(),
    ]);
    // user
    // stadium
    setTimeout(() => {
      this.data.improvingCollection.items = range(12);
      this.updateSignal++;
    }, 10000);
  }

  render() {
    const components: Array<{
      title: string;
      elements: Array<{ descr: string; e: any }>;
      caseStyle?: { [key: string]: string };
    }> = [
      this.langSelect(),
      this.globalSearch(),
      this.banner(),
      this.playerCareer(),
      this.playerTransfers(),
      this.playerMedia(),
      this.playerGames(),
      this.personGames(),
      this.stadiumGames(),
      this.teamSeasons(),
      this.teamTransfers(),
      this.teamRoster(),
      this.teamGames(),
      this.teamMedia(),
      this.seasonMedia(),
      this.seasonBestPlayers(),
      this.seasonGames(),
      this.seasonStandings(),
      this.seasonBirthdays(),
      this.leagueBirthdays(),
      this.leagueChamps(),
      this.leagueMedia(),
      this.leagueDocuments(),
      this.leagueStadiums(),
      this.leagueTeams(),
      this.gameMedia(),
      this.gameCard(),
      this.gameScoreboard(),
      this.gameStatsPreview(),
      this.gameEvents(),
      this.gameLineups(),
      this.teamLogo(),
      this.userPhoto(),
      this.playerPhoto(),
      this.stadiumPhoto(),
      this.photoGallery(),
      this.improvingImg(),
      this.gamePhotoPreview(),
      this.pagination(),
      this.paginationWithCollection(),
      this.search(),
      this.tabs(),
    ];

    return (
      <Host>
        <ftb-app>
          {components.map(c => (
            <div class="component">
              <h4>{c.title}</h4>
              <div class="elements">
                {c.elements.map(el => (
                  <div class="case" style={c.caseStyle || {}}>
                    {el.e()}
                    <p>{el.descr}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ftb-app>
      </Host>
    );
  }

  private langSelect() {
    return {
      title: 'Language select',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-language-select></ftb-language-select>,
        },
      ],
    };
  }

  private banner() {
    return {
      title: 'Partner banner',
      elements: [
        {
          descr: 'Basic',
          e: () => (
            <ftb-partner-banner
              slotCode={BannerSlotCode.site_footer}
              leagueId={this.data.league._id}
            ></ftb-partner-banner>
          ),
        },
      ],
    };
  }

  private globalSearch() {
    return {
      title: 'Global search',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-global-search></ftb-global-search>,
        },
      ],
    };
  }

  private playerCareer() {
    return {
      title: 'Player career',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-player-career player={this.data.player}></ftb-player-career>,
        },
      ],
    };
  }

  private playerTransfers() {
    return {
      title: 'Player transfers',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-player-transfers player={this.data.player}></ftb-player-transfers>,
        },
      ],
    };
  }

  private playerGames() {
    return {
      title: 'Player games',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-player-games player={this.data.player}></ftb-player-games>,
        },
      ],
    };
  }

  private playerMedia() {
    return {
      title: 'Player media',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-player-media player={this.data.player}></ftb-player-media>,
        },
      ],
    };
  }

  private personGames() {
    return {
      title: 'Person games',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-person-games person={this.data.person}></ftb-person-games>,
        },
      ],
    };
  }

  private stadiumGames() {
    return {
      title: 'Stadium games',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-stadium-games stadium={this.data.stadium}></ftb-stadium-games>,
        },
      ],
    };
  }

  private teamSeasons() {
    return {
      title: 'Team seasons',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-team-seasons team={this.data.team}></ftb-team-seasons>,
        },
      ],
    };
  }

  private teamTransfers() {
    return {
      title: 'Team transfers',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-team-transfers team={this.data.team}></ftb-team-transfers>,
        },
      ],
    };
  }

  private teamRoster() {
    return {
      title: 'Team roster',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-team-roster team={this.data.team}></ftb-team-roster>,
        },
      ],
    };
  }

  private teamGames() {
    return {
      title: 'Team games',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-team-games team={this.data.team}></ftb-team-games>,
        },
      ],
    };
  }

  private teamMedia() {
    return {
      title: 'Team media',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-team-media team={this.data.team}></ftb-team-media>,
        },
      ],
    };
  }

  private seasonMedia() {
    return {
      title: 'Season media',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-season-media season={this.data.season}></ftb-season-media>,
        },
      ],
    };
  }

  private seasonGames() {
    return {
      title: 'Season games',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-season-games season={this.data.season}></ftb-season-games>,
        },
      ],
    };
  }

  private seasonBirthdays() {
    return {
      title: 'Season birthdays',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-season-birthdays season={this.data.season}></ftb-season-birthdays>,
        },
      ],
    };
  }

  private leagueBirthdays() {
    return {
      title: 'League birthdays',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-league-birthdays league={this.data.league}></ftb-league-birthdays>,
        },
      ],
    };
  }

  private seasonStandings() {
    return {
      title: 'Season Standings',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-season-standings season={this.data.season}></ftb-season-standings>,
        },
      ],
    };
  }

  private seasonBestPlayers() {
    return {
      title: 'Season Best Players',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-season-best-players season={this.data.season}></ftb-season-best-players>,
        },
      ],
    };
  }

  private leagueChamps() {
    return {
      title: 'League champs',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-league-champs league={this.data.league}></ftb-league-champs>,
        },
      ],
    };
  }

  private leagueTeams() {
    return {
      title: 'League teams',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-league-teams league={this.data.league}></ftb-league-teams>,
        },
      ],
    };
  }

  private leagueMedia() {
    return {
      title: 'League media',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-league-media league={this.data.league}></ftb-league-media>,
        },
      ],
    };
  }

  private leagueDocuments() {
    return {
      title: 'League documents',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-league-documents league={this.data.league}></ftb-league-documents>,
        },
      ],
    };
  }

  private leagueStadiums() {
    return {
      title: 'League stadiums',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-league-stadiums league={this.data.league}></ftb-league-stadiums>,
        },
      ],
    };
  }

  private gameCard() {
    return {
      title: 'Game card',
      elements: [
        {
          descr: 'Minimal',
          e: () => <ftb-game-card game={this.data.game}></ftb-game-card>,
        },
        {
          descr: 'With date',
          e: () => (
            <ftb-game-card
              game={this.data.game}
              leftFields={[FtbGameCardField.time]}
              topFields={[FtbGameCardField.date, FtbGameCardField.round]}
            ></ftb-game-card>
          ),
        },
        {
          descr: 'With time and pitch',
          e: () => (
            <ftb-game-card
              game={this.data.game}
              leftFields={[FtbGameCardField.time, FtbGameCardField.stadium]}
              topFields={[FtbGameCardField.champSeason, FtbGameCardField.round]}
            ></ftb-game-card>
          ),
        },
        {
          descr: 'With bottom line',
          e: () => (
            <ftb-game-card
              game={this.data.game}
              leftFields={[FtbGameCardField.time]}
              topFields={[FtbGameCardField.date, FtbGameCardField.round]}
              bottomFields={[FtbGameCardField.champ, FtbGameCardField.season]}
            ></ftb-game-card>
          ),
        },
        {
          descr: 'With playerStats',
          e: () => (
            <ftb-game-card
              game={this.data.game}
              topFields={[FtbGameCardField.champSeason, FtbGameCardField.round]}
              rightFields={[FtbGameCardField.playerStats]}
              playerStats={{ teamId: 1, goals: 0, assists: 1, yellow: 2, red: 1 }}
            ></ftb-game-card>
          ),
        },
      ],
    };
  }

  private gameScoreboard() {
    return {
      title: 'Game scoreboard',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-game-scoreboard game={this.data.game}></ftb-game-scoreboard>,
        },
      ],
    };
  }

  private gameMedia() {
    return {
      title: 'Game media',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-game-media game={this.data.game}></ftb-game-media>,
        },
      ],
    };
  }

  private gameStatsPreview() {
    return {
      title: 'Game stats preview',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-game-stats-preview game={this.data.game}></ftb-game-stats-preview>,
        },
      ],
    };
  }

  private gameLineups() {
    return {
      title: 'Game lineups',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-game-lineups game={this.data.game}></ftb-game-lineups>,
        },
      ],
    };
  }

  private gameEvents() {
    return {
      title: 'Game events',
      elements: [
        {
          descr: 'Basic',
          e: () => <ftb-game-events game={this.data.game}></ftb-game-events>,
        },
      ],
    };
  }

  private teamLogo() {
    return {
      title: 'Team logo',
      elements: [
        {
          descr: 'Argument object',
          e: () => <ftb-team-logo team={new Team({ logo: 'Millwall', logoId: 2 })}></ftb-team-logo>,
        },
        {
          descr: 'Separate arguments',
          e: () => <ftb-team-logo logo="Millwall" version={2}></ftb-team-logo>,
        },
        {
          descr: 'Incorrect logo',
          e: () => <ftb-team-logo team={new Team({ logo: 'not_existing_logo', logoId: 1 })}></ftb-team-logo>,
        },
      ],
    };
  }

  private userPhoto() {
    return {
      title: 'User photo',
      elements: [
        {
          descr: 'Argument object',
          e: () => <ftb-user-photo user={new User({ _id: 1, photoId: 1 })}></ftb-user-photo>,
        },
        {
          descr: 'Separate object',
          e: () => <ftb-user-photo user-id={1} version={2}></ftb-user-photo>,
        },
        {
          descr: 'Incorrect photo',
          e: () => <ftb-user-photo user-id={-1} version={2}></ftb-user-photo>,
        },
      ],
    };
  }

  private playerPhoto() {
    return {
      title: 'Player photo',
      elements: [
        {
          descr: 'Argument object',
          e: () => <ftb-player-photo player={new Player({ _id: 1, photoId: 1 })}></ftb-player-photo>,
        },
        {
          descr: 'Separate object',
          e: () => <ftb-player-photo player-id={1} version={2}></ftb-player-photo>,
        },
        {
          descr: 'Incorrect photo',
          e: () => <ftb-player-photo player-id={-1} version={2}></ftb-player-photo>,
        },
      ],
    };
  }

  private stadiumPhoto() {
    return {
      title: 'Stadium photo',
      elements: [
        {
          descr: 'Argument object',
          e: () => (
            <ftb-stadium-photo
              stadium={new Stadium({ _id: 1101, photoId: 1 })}
              class="stadium-photo-case"
            ></ftb-stadium-photo>
          ),
        },
        {
          descr: 'Separate object',
          e: () => <ftb-stadium-photo stadium-id={1101} version={2} class="stadium-photo-case"></ftb-stadium-photo>,
        },
        {
          descr: 'Incorrect photo',
          e: () => <ftb-stadium-photo stadium-id={-1} version={2} class="stadium-photo-case"></ftb-stadium-photo>,
        },
      ],
    };
  }

  private improvingImg() {
    return {
      title: 'Improving image',
      elements: [
        {
          descr: 'Simple case',
          e: () => (
            <ftb-improving-img
              sources={[
                'https://img.youtube.com/vi/ehZwZ-iotGo/default.jpg',
                'https://img.youtube.com/vi/ehZwZ-iotGo/sddefault.jpg',
                'https://sun9-72.userapi.com/c855136/v855136020/23a475/AGI_Y0YT3fk.jpg',
              ]}
            ></ftb-improving-img>
          ),
        },
      ],
    };
  }

  private pagination() {
    const renderItem = (item: number) => <div class="pag-item">{item}</div>;
    const rows = 2;
    const itemMinWidthPx = 100;
    const itemHeightPx = 54;

    return {
      title: 'Pagination',
      caseStyle: { flex: '1' },
      elements: [
        {
          descr: 'wide',
          e: () => (
            <ftb-pagination
              totalItems={12}
              items={range(12)}
              renderItem={renderItem}
              rows={rows}
              itemMinWidthPx={itemMinWidthPx}
              itemHeightPx={itemHeightPx}
            ></ftb-pagination>
          ),
        },
        {
          descr: 'narrow',
          e: () => (
            <ftb-pagination
              totalItems={12}
              items={range(12)}
              renderItem={renderItem}
              rows={rows}
              itemMinWidthPx={itemMinWidthPx}
              itemHeightPx={itemHeightPx}
              style={{ 'max-width': '300px' }}
            ></ftb-pagination>
          ),
        },
        {
          descr: 'many pages',
          e: () => (
            <ftb-pagination
              totalItems={120}
              items={range(120)}
              renderItem={renderItem}
              rows={rows}
              itemMinWidthPx={itemMinWidthPx}
              itemHeightPx={itemHeightPx}
              style={{ 'max-width': '300px' }}
            ></ftb-pagination>
          ),
        },
      ],
    };
  }

  private paginationWithCollection() {
    const renderItem = (item: number) => <div class="pag-item">{item}</div>;
    const rows = 2;
    const itemMinWidthPx = 100;
    const itemHeightPx = 54;

    return {
      title: 'Pagination with partially loaded collection',
      elements: [
        {
          descr: 'loaded 7 of 12',
          e: () => (
            <ftb-pagination
              totalItems={12}
              items={range(7)}
              renderItem={renderItem}
              rows={rows}
              itemMinWidthPx={itemMinWidthPx}
              itemHeightPx={itemHeightPx}
              style={{ 'max-width': '300px' }}
            ></ftb-pagination>
          ),
        },
        {
          descr: '7/12, rest loaded in 10 sec.',
          e: () => this.createImprovedPagination(),
        },
      ],
    };
  }

  private createImprovedPagination() {
    const renderItem = (item: number) => <div class="pag-item">{item}</div>;
    const rows = 2;
    const itemMinWidthPx = 100;
    const itemHeightPx = 54;

    return (
      <ftb-pagination
        totalItems={this.data.improvingCollection.total}
        items={this.data.improvingCollection.items}
        renderItem={renderItem}
        rows={rows}
        itemMinWidthPx={itemMinWidthPx}
        itemHeightPx={itemHeightPx}
        style={{ 'max-width': '300px', 'min-width': '300px' }}
      ></ftb-pagination>
    );
  }

  private tabs() {
    return {
      title: 'Tabs',
      caseStyle: { 'height': '229px', 'justify-content': 'flex-start' },
      elements: [
        {
          descr: 'With paginated content',
          e: () => (
            <ftb-tabs
              tabs={[
                { renderTitle: () => 'First', renderContent: () => this.createImprovedPagination() },
                { renderTitle: () => 'Second', renderContent: () => <div>second tab</div> },
              ]}
            ></ftb-tabs>
          ),
        },
        {
          descr: 'With search',
          e: () => (
            <ftb-tabs
              tabs={[
                { renderTitle: () => 'First', renderContent: () => this.search().elements[1].e() },
                { renderTitle: () => 'Second', renderContent: () => <div>second tab</div> },
              ]}
            ></ftb-tabs>
          ),
        },
      ],
    };
  }

  private search() {
    const filterFn = (items: number[], query: string, categories: CategoryInterface[]) => {
      const oddevenVal = categories.find(c => c.key === 'oddeven').options.find(o => o.selected).key;
      if (oddevenVal === 'odd') items = items.filter(i => i % 2);
      if (oddevenVal === 'even') items = items.filter(i => !(i % 2));
      return Promise.resolve(query ? items.filter(i => (i + '').includes(query)) : items);
    };

    return {
      title: 'Search',
      elements: [
        {
          descr: 'Search numbers',
          e: () => (
            <ftb-searchable-content
              items={range(50)}
              renderItems={items => (
                <div style={{ 'display': 'flex', 'flex-wrap': 'wrap', 'justify-content': 'center' }}>
                  {items.map(i => (
                    <span class="content-item">{i}</span>
                  ))}
                </div>
              )}
              filterFn={filterFn}
              placeholder="Search by number"
              categories={[
                {
                  key: 'oddeven',
                  placeholder: 'Filter',
                  filterFn: (query, options) => filter(options, query, ['text']),
                  renderItem: i => i.text,
                  options: [
                    { key: 'all', text: 'All items' },
                    { key: 'odd', text: 'Odd' },
                    { key: 'even', text: 'Even' },
                  ],
                },
              ]}
            ></ftb-searchable-content>
          ),
        },
        {
          descr: 'With pagination',
          e: () => (
            <ftb-searchable-content
              items={range(50)}
              renderItems={items => {
                return (
                  <ftb-pagination
                    totalItems={items.length}
                    items={items}
                    renderItem={(item: number) => <div class="pag-item">{item}</div>}
                    rows={2}
                    itemMinWidthPx={100}
                    itemHeightPx={54}
                  ></ftb-pagination>
                );
              }}
              filterFn={filterFn}
              placeholder="Search by number"
              categories={[
                {
                  key: 'oddeven',
                  placeholder: 'Filter',
                  filterFn: (query, options) => filter(options, query, ['text']),
                  renderItem: i => i.text,
                  options: [
                    { key: 'all', text: 'All items' },
                    { key: 'odd', text: 'Odd' },
                    { key: 'even', text: 'Even' },
                  ],
                },
              ]}
            ></ftb-searchable-content>
          ),
        },
      ],
    };
  }

  private gamePhotoPreview() {
    return {
      title: 'Game photo preview',
      elements: [
        {
          descr: 'small',
          e: () => (
            <ftb-game-photo-preview
              photo={this.data.game.photoset.photos.items[0]}
              style={{ height: '50px', width: '100px' }}
            ></ftb-game-photo-preview>
          ),
        },
        {
          descr: 'big',
          e: () => (
            <ftb-game-photo-preview
              photo={this.data.game.photoset.photos.items[0]}
              style={{ height: '100px', width: '200px' }}
            ></ftb-game-photo-preview>
          ),
        },
        {
          descr: 'incorrect',
          e: () => (
            <ftb-game-photo-preview
              photo={{
                thumb: new GamePhotoImg(
                  'https://sun9-10.userapi.com/impf/c851536/v851536702/15a74a/incorrect.jpg?size=1280x948&quality=96&sign=ffa05f7d2b59768d20eb91756d1a87fd&c_uniq_tag=muP6oinQviXYTcY30xJpPaTl5czvWHNwJXqCc01bJQA',
                ),
                middle: new GamePhotoImg(
                  'https://sun9-10.userapi.com/impf/c851536/v851536702/15a74a/incorrect.jpg?size=1280x948&quality=96&sign=ffa05f7d2b59768d20eb91756d1a87fd&c_uniq_tag=muP6oinQviXYTcY30xJpPaTl5czvWHNwJXqCc01bJQA',
                ),
                full: null,
                hd: null,
              }}
              style={{ height: '100px', width: '200px' }}
            ></ftb-game-photo-preview>
          ),
        },
      ],
    };
  }

  private photoGallery() {
    const open = (photo: GamePhoto) => {
      const idx = this.data.game.photoset.photos.items.findIndex(p => p.thumb === photo.thumb);
      this.data.galleryIdx = idx;
      this.data.showGallery = true;
      this.updateSignal++;
    };

    const close = () => {
      this.data.showGallery = false;
      this.updateSignal++;
    };

    return {
      title: 'photo-gallery',
      elements: [
        {
          descr: 'basic',
          e: () => (
            <div class="photo-gallery">
              {this.data.showGallery && (
                <ftb-photo-gallery
                  game={this.data.game}
                  onClosed={() => close()}
                  start={this.data.galleryIdx}
                ></ftb-photo-gallery>
              )}
              <ftb-pagination
                totalItems={this.data.game.photoset.photos.total}
                items={this.data.game.photoset.photos.items}
                renderItem={i => (
                  <ftb-game-photo-preview
                    photo={i}
                    style={{ height: '96px', width: '130px' }}
                    onClick={() => open(i)}
                  ></ftb-game-photo-preview>
                )}
                rows={2}
                itemMinWidthPx={130}
                itemHeightPx={96}
              ></ftb-pagination>
            </div>
          ),
        },
      ],
    };
  }
}
