// import { Component, h, Host, State } from '@stencil/core';
// import {
//   BannerSlotCode,
//   Champ,
//   Collection,
//   envState,
//   filter,
//   Game,
//   GamePhoto,
//   GamePhotoImg,
//   GameService,
//   Language,
//   League,
//   LeagueService,
//   LicenseAgreement,
//   LicenseAgreementService,
//   NewsService,
//   PersonService,
//   Player,
//   PlayerService,
//   Season,
//   SeasonService,
//   Sports,
//   Stadium,
//   StadiumService,
//   Team,
//   TeamService,
//   User,
//   Post,
// } from 'ftb-models';
// import range from 'lodash-es/range';
// import { CategoryInterface } from '../ftb-searchable-content/ftb-searchable-content.component';
// import { Partner } from 'ftb-models/dist/models/partner.model';
//
// /**
//  * Test page that demonstrates all existing components
//  */
// @Component({
//   tag: 'cmp-showcase',
//   styleUrl: 'cmp-showcase.component.scss',
//   shadow: true,
// })
// export class CmpTest {
//   @State() updateSignal = 0;
//
//   private data = {
//     improvingCollection: new Collection({ total: 12, items: range(7) }),
//     // game: new Game({ _id: 347476 }),
//     game: new Game({ _id: 313283 }),
//     league: new League({ _id: 394 }),
//     champ: new Champ({ _id: 2117 }),
//     season: new Season({ _id: 4205 }),
//     // season: new Season({ _id: 4270 }),
//     team: new Team({ _id: 18804 }),
//     person: new User({ _id: 750 }),
//     stadium: new Stadium({ _id: 1086 }),
//     player: new Player({ _id: 453593 }),
//     post: new Post({ _id: 88063 }),
//     showGallery: false,
//     galleryIdx: 0,
//     licenseAgreement: new LicenseAgreement(),
//   };
//
//   async componentWillLoad() {
//     envState.localHost = location.href.split('/')[0];
//     envState.envMode = 'dev';
//     envState.imgHost = 'https://footballista.ru/api/';
//     await Promise.all([
//       (async () => (this.data.game = await new GameService().loadFullGameInfo(this.data.game._id)))(),
//       (async () => (this.data.league = await new LeagueService().loadLeagueInfo(this.data.league._id)))(),
//       (async () => (this.data.season = await new SeasonService().loadSeasonStandings(this.data.season._id)))(),
//       (async () => (this.data.team = await new TeamService().loadTeamInfo(this.data.team._id)))(),
//       (async () => (this.data.stadium = await new StadiumService().loadStadiumGames(this.data.stadium._id)))(),
//       (async () => (this.data.person = await new PersonService().loadPersonInfo(this.data.person._id)))(),
//       (async () => (this.data.player = await new PlayerService().loadPlayerInfo(this.data.player._id)))(),
//       (async () => (this.data.post = await new NewsService().loadPostInfo(this.data.post._id)))(),
//       (async () =>
//         (this.data.licenseAgreement = await new LicenseAgreementService().loadLicenseAgreement(
//           'AFL_RU',
//           Language.ru,
//         )))(),
//     ]);
//
//     this.data.season.stages.forEach(s => (s.season = this.data.season));
//
//     // user
//     // stadium
//     setTimeout(() => {
//       this.data.improvingCollection.items = range(12);
//       this.updateSignal++;
//     }, 10000);
//   }
//
//   render() {
//     const components: Array<{
//       title: string;
//       elements: Array<{ descr: string; e: any }>;
//       caseStyle?: { [key: string]: string };
//     }> = [
//       this.teamLogo(),
//       this.langSelect(),
//       this.ftbImg(),
//       this.globalSearch(),
//       this.leagueSportsIcon(),
//       this.postBody(),
//       this.postPhoto(),
//       this.licenseAgreement(),
//       this.banner(),
//       this.profileAlerts(),
//       this.stageTable(),
//       this.userPhoto(),
//       this.partnerPhoto(),
//       this.playerPhoto(),
//       this.stadiumPhoto(),
//       this.photoGallery(),
//       this.gamePhotos(),
//       this.improvingImg(),
//       this.gamePhotoPreview(),
//       this.pagination(),
//       this.paginationWithCollection(),
//       this.paginationWithFixedHeight(),
//       this.paginationWithFixedHeight2(),
//       this.search(),
//       this.tabs(),
//       this.virtualScroll(),
//     ];
//
//     return (
//       <Host>
//         <ftb-app>
//           {components.map(c => (
//             <div class="component">
//               <h4>{c.title}</h4>
//               <div class="elements">
//                 {c.elements.map(el => (
//                   <div class="case" style={c.caseStyle || {}}>
//                     {el.e()}
//                     <p>{el.descr}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </ftb-app>
//       </Host>
//     );
//   }
//
//   private langSelect() {
//     return {
//       title: 'Language select',
//       elements: [
//         {
//           descr: 'Basic',
//           e: () => <ftb-language-select></ftb-language-select>,
//         },
//       ],
//     };
//   }
//
//   private ftbImg() {
//     return {
//       title: 'Ftb img ',
//       elements: [
//         {
//           descr: 'basic',
//           e: () => [<ftb-img src="https://footballista.ru/api/img/logos/West%20Ham-middle.png?logoId=2" />],
//         },
//       ],
//     };
//   }
//
//   private leagueSportsIcon() {
//     return {
//       title: 'League sports ',
//       elements: [
//         {
//           descr: 'Football',
//           e: () => <ftb-league-sports-icon league={new League({ sports: Sports.football })} />,
//         },
//         {
//           descr: 'Volleyball',
//           e: () => <ftb-league-sports-icon league={new League({ sports: Sports.volleyball })} />,
//         },
//         {
//           descr: 'basketball',
//           e: () => <ftb-league-sports-icon league={new League({ sports: Sports.basketball })} />,
//         },
//         {
//           descr: 'Water polo',
//           e: () => <ftb-league-sports-icon league={new League({ sports: Sports.water_polo })} />,
//         },
//       ],
//     };
//   }
//
//   private banner() {
//     return {
//       title: 'Partner banner',
//       elements: [
//         {
//           descr: 'Basic',
//           e: () => (
//             <ftb-partner-banner
//               slotCode={BannerSlotCode.site_footer}
//               leagueId={this.data.league._id}
//             ></ftb-partner-banner>
//           ),
//         },
//       ],
//     };
//   }
//
//   private globalSearch() {
//     return {
//       title: 'Global search',
//       elements: [
//         {
//           descr: 'Basic',
//           e: () => <ftb-global-search />,
//         },
//       ],
//     };
//   }
//
//   private postBody() {
//     return {
//       title: 'Post body',
//       elements: [
//         {
//           descr: 'Basic',
//           e: () => <ftb-post-body post={this.data.post} />,
//         },
//       ],
//     };
//   }
//
//   private postPhoto() {
//     return {
//       title: 'Post photo',
//       elements: [
//         {
//           descr: 'Basic',
//           e: () => <ftb-post-photo post={this.data.post} mode="min" />,
//         },
//       ],
//     };
//   }
//
//   private licenseAgreement() {
//     return {
//       title: 'License agreement',
//       elements: [
//         {
//           descr: 'Basic',
//           e: () => <ftb-license-agreement license={this.data.licenseAgreement} />,
//         },
//       ],
//     };
//   }
//
//   private profileAlerts() {
//     return {
//       title: 'Profile Alerts',
//       elements: [
//         {
//           descr: 'Basic',
//           e: () => <ftb-alerts-feed></ftb-alerts-feed>,
//         },
//       ],
//     };
//   }
//   private stageTable() {
//     return {
//       title: 'Stage table',
//       elements: [
//         {
//           descr: 'Basic',
//           e: () => (
//             <ftb-stage-table
//               class="stage-table"
//               stage={this.data.season.stages[0]}
//               rowsLimit={{ limit: 5, baseTeam: this.data.team }}
//             />
//           ),
//         },
//       ],
//     };
//   }
//
//   private teamLogo() {
//     return {
//       title: 'Team logo',
//       elements: [
//         {
//           descr: 'Argument object',
//           e: () => <ftb-team-logo team={new Team({ logo: 'Millwall', logoId: 2 })}></ftb-team-logo>,
//         },
//         {
//           descr: 'Separate arguments',
//           e: () => <ftb-team-logo logo="Millwall" version={2}></ftb-team-logo>,
//         },
//         {
//           descr: 'Incorrect logo',
//           e: () => <ftb-team-logo team={new Team({ logo: 'not_existing_logo', logoId: 1 })}></ftb-team-logo>,
//         },
//       ],
//     };
//   }
//
//   private userPhoto() {
//     return {
//       title: 'User photo',
//       elements: [
//         {
//           descr: 'Argument object',
//           e: () => <ftb-user-photo user={new User({ _id: 1, photoId: 1 })}></ftb-user-photo>,
//         },
//         {
//           descr: 'Separate object',
//           e: () => <ftb-user-photo user-id={1} version={2}></ftb-user-photo>,
//         },
//         {
//           descr: 'Incorrect photo',
//           e: () => <ftb-user-photo user-id={-1} version={2}></ftb-user-photo>,
//         },
//       ],
//     };
//   }
//
//   private partnerPhoto() {
//     console.log(new Partner({ _id: 2, photoId: 1 }));
//     return {
//       title: 'Partner photo',
//       elements: [
//         {
//           descr: 'Argument object',
//           e: () => <ftb-partner-photo partner={new Partner({ _id: 2, photoId: 1 })} />,
//         },
//         {
//           descr: 'Incorrect photo',
//           e: () => <ftb-partner-photo partner-id={-1} version={2} />,
//         },
//       ],
//     };
//   }
//
//   private playerPhoto() {
//     return {
//       title: 'Player photo',
//       elements: [
//         {
//           descr: 'Argument object',
//           e: () => <ftb-player-photo player={new Player({ _id: 1, photoId: 1 })}></ftb-player-photo>,
//         },
//         {
//           descr: 'Separate object',
//           e: () => <ftb-player-photo player-id={1} version={2}></ftb-player-photo>,
//         },
//         {
//           descr: 'Incorrect photo',
//           e: () => <ftb-player-photo player-id={-1} version={2}></ftb-player-photo>,
//         },
//       ],
//     };
//   }
//
//   private stadiumPhoto() {
//     return {
//       title: 'Stadium photo',
//       elements: [
//         {
//           descr: 'Argument object',
//           e: () => (
//             <ftb-stadium-photo
//               stadium={new Stadium({ _id: 1101, photoId: 1 })}
//               class="stadium-photo-case"
//             ></ftb-stadium-photo>
//           ),
//         },
//         {
//           descr: 'Separate object',
//           e: () => <ftb-stadium-photo stadium-id={1101} version={2} class="stadium-photo-case"></ftb-stadium-photo>,
//         },
//         {
//           descr: 'Incorrect photo',
//           e: () => <ftb-stadium-photo stadium-id={-1} version={2} class="stadium-photo-case"></ftb-stadium-photo>,
//         },
//       ],
//     };
//   }
//
//   private improvingImg() {
//     return {
//       title: 'Improving image',
//       elements: [
//         {
//           descr: 'Simple case',
//           e: () => (
//             <ftb-improving-img
//               sources={[
//                 'https://img.youtube.com/vi/ehZwZ-iotGo/default.jpg',
//                 'https://img.youtube.com/vi/ehZwZ-iotGo/sddefault.jpg',
//                 'https://sun9-72.userapi.com/c855136/v855136020/23a475/AGI_Y0YT3fk.jpg',
//               ]}
//             ></ftb-improving-img>
//           ),
//         },
//       ],
//     };
//   }
//
//   private pagination() {
//     const renderItem = (item: number) => <div class="pag-item">{item}</div>;
//     const rows = 2;
//     const itemMinWidthPx = 100;
//     const itemHeightPx = 54;
//
//     return {
//       title: 'Pagination',
//       caseStyle: { flex: '1' },
//       elements: [
//         {
//           descr: 'wide',
//           e: () => (
//             <ftb-pagination
//               totalItems={12}
//               items={range(12)}
//               renderItem={renderItem}
//               rows={rows}
//               itemMinWidthPx={itemMinWidthPx}
//               itemMinHeightPx={itemHeightPx}
//             ></ftb-pagination>
//           ),
//         },
//         {
//           descr: 'narrow',
//           e: () => (
//             <ftb-pagination
//               totalItems={12}
//               items={range(12)}
//               renderItem={renderItem}
//               rows={rows}
//               itemMinWidthPx={itemMinWidthPx}
//               itemMinHeightPx={itemHeightPx}
//               style={{ 'max-width': '300px' }}
//             />
//           ),
//         },
//         {
//           descr: 'many pages',
//           e: () => (
//             <ftb-pagination
//               totalItems={120}
//               items={range(120)}
//               renderItem={renderItem}
//               rows={rows}
//               itemMinWidthPx={itemMinWidthPx}
//               itemMinHeightPx={itemHeightPx}
//               style={{ 'max-width': '300px' }}
//             />
//           ),
//         },
//       ],
//     };
//   }
//
//   private paginationWithCollection() {
//     const renderItem = (item: number) => <div class="pag-item">{item}</div>;
//     const rows = 2;
//     const itemMinWidthPx = 100;
//     const itemHeightPx = 54;
//
//     return {
//       title: 'Pagination with partially loaded collection',
//       elements: [
//         {
//           descr: 'loaded 7 of 12',
//           e: () => (
//             <ftb-pagination
//               totalItems={12}
//               items={range(7)}
//               renderItem={renderItem}
//               rows={rows}
//               itemMinWidthPx={itemMinWidthPx}
//               itemMinHeightPx={itemHeightPx}
//               style={{ 'max-width': '300px' }}
//             />
//           ),
//         },
//         {
//           descr: '7/12, rest loaded in 10 sec.',
//           e: () => this.createImprovedPagination(),
//         },
//       ],
//     };
//   }
//
//   private paginationWithFixedHeight2() {
//     const renderItem = (item: number) => <div class="pag-item">{item}</div>;
//     const height = 200;
//     const itemMinWidthPx = 100;
//     const itemHeightPx = 54;
//
//     return {
//       title: 'Pagination with fixed height',
//       elements: [
//         {
//           descr: 'fixed height 200px; item ratio 1/1',
//           e: () => (
//             <ftb-pagination
//               class="pagination-with-fixed-height"
//               totalItems={100}
//               items={range(100)}
//               renderItem={renderItem}
//               fixedContainerHeightPx={height}
//               itemMinWidthPx={itemMinWidthPx}
//               XtoY={16 / 9}
//               itemMinHeightPx={itemHeightPx}
//             />
//           ),
//         },
//       ],
//     };
//   }
//
//   private paginationWithFixedHeight() {
//     const renderItem = (item: number) => <div class="pag-item">{item}</div>;
//     const containerHeight = 200;
//     const itemMinWidthPx = 100;
//     const itemHeightPx = 54;
//
//     return {
//       title: 'Pagination with fixed height',
//       elements: [
//         {
//           descr: 'fixed height 200px; fixed item height',
//           e: () => (
//             <ftb-pagination
//               class="pagination-with-fixed-height"
//               totalItems={50}
//               items={range(50)}
//               renderItem={renderItem}
//               fixedContainerHeightPx={containerHeight}
//               itemMinWidthPx={itemMinWidthPx}
//               stretchY={false}
//               itemMinHeightPx={itemHeightPx}
//             />
//           ),
//         },
//         {
//           descr: 'fixed height 200px; stretching item height',
//           e: () => (
//             <ftb-pagination
//               class="pagination-with-fixed-height"
//               totalItems={50}
//               items={range(50)}
//               renderItem={renderItem}
//               fixedContainerHeightPx={containerHeight}
//               itemMinWidthPx={itemMinWidthPx}
//               stretchY={true}
//               itemMinHeightPx={itemHeightPx}
//             />
//           ),
//         },
//       ],
//     };
//   }
//
//   private createImprovedPagination() {
//     const renderItem = (item: number) => <div class="pag-item">{item}</div>;
//     const rows = 2;
//     const itemMinWidthPx = 100;
//     const itemHeightPx = 54;
//
//     return (
//       <ftb-pagination
//         totalItems={this.data.improvingCollection.total}
//         items={this.data.improvingCollection.items}
//         renderItem={renderItem}
//         rows={rows}
//         itemMinWidthPx={itemMinWidthPx}
//         itemMinHeightPx={itemHeightPx}
//         style={{ 'max-width': '300px', 'min-width': '300px' }}
//       />
//     );
//   }
//
//   private tabs() {
//     return {
//       title: 'Tabs',
//       caseStyle: { 'height': '229px', 'justify-content': 'flex-start' },
//       elements: [
//         {
//           descr: 'With paginated content',
//           e: () => (
//             <ftb-tabs
//               tabs={[
//                 { renderTitle: () => 'First', renderContent: () => this.createImprovedPagination() },
//                 { renderTitle: () => 'Second', renderContent: () => <div>second tab</div> },
//               ]}
//             />
//           ),
//         },
//         {
//           descr: 'With search',
//           e: () => (
//             <ftb-tabs
//               tabs={[
//                 { renderTitle: () => 'First', renderContent: () => this.search().elements[1].e() },
//                 { renderTitle: () => 'Second', renderContent: () => <div>second tab</div> },
//               ]}
//             />
//           ),
//         },
//       ],
//     };
//   }
//
//   private search() {
//     const filterFn = (items: number[], query: string, categories: CategoryInterface[]) => {
//       const oddevenVal = categories.find(c => c.key === 'oddeven').options.find(o => o.selected).key;
//       if (oddevenVal === 'odd') items = items.filter(i => i % 2);
//       if (oddevenVal === 'even') items = items.filter(i => !(i % 2));
//       return Promise.resolve(query ? items.filter(i => (i + '').includes(query)) : items);
//     };
//
//     return {
//       title: 'Search',
//       elements: [
//         {
//           descr: 'Search numbers',
//           e: () => (
//             <ftb-searchable-content
//               items={range(50)}
//               renderItems={items => (
//                 <div style={{ 'display': 'flex', 'flex-wrap': 'wrap', 'justify-content': 'center' }}>
//                   {items.map(i => (
//                     <span class="content-item">{i}</span>
//                   ))}
//                 </div>
//               )}
//               filterFn={filterFn}
//               placeholder="Search by number"
//               categories={[
//                 {
//                   key: 'oddeven',
//                   placeholder: 'Filter',
//                   filterFn: (query, options) => filter(options, query, ['text']),
//                   renderItem: i => i.text,
//                   options: [
//                     { key: 'all', text: 'All items' },
//                     { key: 'odd', text: 'Odd' },
//                     { key: 'even', text: 'Even' },
//                   ],
//                 },
//               ]}
//             ></ftb-searchable-content>
//           ),
//         },
//         {
//           descr: 'With pagination',
//           e: () => (
//             <ftb-searchable-content
//               items={range(50)}
//               renderItems={items => {
//                 return (
//                   <ftb-pagination
//                     totalItems={items.length}
//                     items={items}
//                     renderItem={(item: number) => <div class="pag-item">{item}</div>}
//                     rows={2}
//                     itemMinWidthPx={100}
//                     itemMinHeightPx={54}
//                   />
//                 );
//               }}
//               filterFn={filterFn}
//               placeholder="Search by number"
//               categories={[
//                 {
//                   key: 'oddeven',
//                   placeholder: 'Filter',
//                   filterFn: (query, options) => filter(options, query, ['text']),
//                   renderItem: i => i.text,
//                   options: [
//                     { key: 'all', text: 'All items' },
//                     { key: 'odd', text: 'Odd' },
//                     { key: 'even', text: 'Even' },
//                   ],
//                 },
//               ]}
//             />
//           ),
//         },
//       ],
//     };
//   }
//
//   private gamePhotoPreview() {
//     return {
//       title: 'Game photo preview',
//       elements: [
//         {
//           descr: 'small',
//           e: () => (
//             <ftb-game-photo-preview
//               photo={this.data.game.photoset.photos.items[0]}
//               style={{ height: '50px', width: '100px' }}
//             />
//           ),
//         },
//         {
//           descr: 'big',
//           e: () => (
//             <ftb-game-photo-preview
//               photo={this.data.game.photoset.photos.items[0]}
//               style={{ height: '100px', width: '200px' }}
//             />
//           ),
//         },
//         {
//           descr: 'incorrect',
//           e: () => (
//             <ftb-game-photo-preview
//               photo={{
//                 thumb: new GamePhotoImg(
//                   'https://sun9-10.userapi.com/impf/c851536/v851536702/15a74a/incorrect.jpg?size=1280x948&quality=96&sign=ffa05f7d2b59768d20eb91756d1a87fd&c_uniq_tag=muP6oinQviXYTcY30xJpPaTl5czvWHNwJXqCc01bJQA',
//                 ),
//                 middle: new GamePhotoImg(
//                   'https://sun9-10.userapi.com/impf/c851536/v851536702/15a74a/incorrect.jpg?size=1280x948&quality=96&sign=ffa05f7d2b59768d20eb91756d1a87fd&c_uniq_tag=muP6oinQviXYTcY30xJpPaTl5czvWHNwJXqCc01bJQA',
//                 ),
//                 full: null,
//                 hd: null,
//               }}
//               style={{ height: '100px', width: '200px' }}
//             />
//           ),
//         },
//       ],
//     };
//   }
//
//   private photoGallery() {
//     const open = (photo: GamePhoto) => {
//       const idx = this.data.game.photoset.photos.items.findIndex(p => p.thumb === photo.thumb);
//       this.data.galleryIdx = idx;
//       this.data.showGallery = true;
//       this.updateSignal++;
//     };
//
//     const close = () => {
//       this.data.showGallery = false;
//       this.updateSignal++;
//     };
//
//     return {
//       title: 'photo-gallery',
//       elements: [
//         {
//           descr: 'basic',
//           e: () => (
//             <div class="photo-gallery">
//               {this.data.showGallery && (
//                 <ftb-photo-gallery game={this.data.game} onClosed={() => close()}></ftb-photo-gallery>
//               )}
//               <ftb-pagination
//                 totalItems={this.data.game.photoset.photos.total}
//                 items={this.data.game.photoset.photos.items}
//                 renderItem={i => (
//                   <ftb-game-photo-preview
//                     photo={i}
//                     style={{ height: '96px', width: '130px' }}
//                     onClick={() => open(i)}
//                   />
//                 )}
//                 rows={2}
//                 itemMinWidthPx={130}
//                 itemMinHeightPx={96}
//               />
//             </div>
//           ),
//         },
//       ],
//     };
//   }
//
//   private gamePhotos() {
//     return {
//       title: 'photo-gallery',
//       elements: [
//         {
//           descr: 'basic',
//           e: () => <ftb-game-photos game={this.data.game} />,
//         },
//       ],
//     };
//   }
//
//   private virtualScroll() {
//     return {
//       title: 'virtual-scroll',
//       elements: [
//         {
//           descr: 'basic',
//           e: () => <ftb-virtual-scroll items={[1, 2, 3]} itemHeight={50} renderItem={i => <div>{i}</div>} />,
//         },
//       ],
//     };
//   }
// }
