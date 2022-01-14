/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import { Game, GameVideo, League, LicenseAgreement, Player, Post, Stadium, Stage, Team, User } from 'ftb-models';
import { Partner } from 'ftb-models/dist/models/partner.model';
import { CategoryInterface } from './components/ftb-searchable-content/ftb-searchable-content.component';
export namespace Components {
  interface FtbCodeSnippet {
    code: string;
    language: string;
  }
  interface FtbCupNetQuadratic {
    /**
     * team to highlight on the net with color
     */
    highlightTeam?: Team;
    stage: Stage;
  }
  interface FtbFlag {
    /**
     * if  passed, component will callback color palette, defined for flag
     */
    extractColors?: (RGBs: Array<[number, number, number]>) => any;
    flag: string;
  }
  interface FtbFlagStories {}
  interface FtbGameDate {
    game: Game;
    withtime: boolean;
  }
  interface FtbGamePhotoGallery {
    game: Game;
    open: (idx: number) => Promise<any>;
  }
  interface FtbGamePhotoGalleryStories {
    prefetchMode: boolean;
  }
  interface FtbGameState {
    game: Game;
  }
  interface FtbGameStateStories {}
  interface FtbGameTour {
    game: Game;
  }
  interface FtbGameTourStories {}
  interface FtbGlobalSearch {}
  interface FtbIcon {
    svg: string;
  }
  interface FtbIconStories {}
  interface FtbInfiniteScroll {
    /**
     * method that is called when user scrolls to a component
     */
    loadData: () => Promise<any>;
  }
  interface FtbInfiniteScrollStories {}
  interface FtbLeagueLogo {
    league: League;
  }
  interface FtbLeagueLogoStories {}
  interface FtbLeagueSportsIcon {
    league: League;
  }
  interface FtbLeagueSportsIconStories {}
  interface FtbLicenseAgreement {
    license: LicenseAgreement;
  }
  interface FtbPagination {
    /**
     * number of items per each page
     */
    itemsPerPage: number;
    /**
     * render function for items chunk
     */
    renderPage: (fromIdx, toIdx) => string | string[];
    /**
     * total items
     */
    totalItems: number;
  }
  interface FtbPaginationStories {}
  interface FtbPartnerBanner {}
  interface FtbPartnerBannerStories {}
  interface FtbPartnerPhoto {
    partner: Partner;
  }
  interface FtbPartnerPhotoStories {}
  interface FtbPlayerPhoto {
    lazy: boolean;
    player: Player;
  }
  interface FtbPlayerPhotoStories {}
  interface FtbPostBody {
    post: Post;
  }
  interface FtbPostCover {
    post: Post;
  }
  interface FtbPostPhoto {
    /**
     * If not defined, image resolution will be detected from on element size
     */
    mode?: 'min' | 'middle' | 'max';
    post: Post;
  }
  interface FtbPostPhotoStories {}
  interface FtbSearchableContent {
    categories: CategoryInterface[];
    clear: number;
    debounce: number;
    filterFn: (items: any[], query: string, categories?: CategoryInterface[]) => Promise<any[]>;
    /**
     * alternative to "categories" property. used when categories list should be updated on category change
     */
    getCategories: (currentCategories?: CategoryInterface[]) => CategoryInterface[];
    items: any[];
    placeholder: string;
    renderItems: (items: any[]) => string | string[];
  }
  interface FtbSearchableContentStories {}
  interface FtbShowcaseMain {}
  interface FtbShowcasePage {}
  interface FtbSpinner {}
  interface FtbSpinnerStories {}
  interface FtbStadiumPhoto {
    lazy: boolean;
    stadium: Stadium;
  }
  interface FtbStadiumPhotoStories {}
  interface FtbStageCupNet {
    highlightTeam?: Team;
    stage: Stage;
  }
  interface FtbStageCupNetOld {
    stage: Stage;
  }
  interface FtbStageCupNetStories {}
  interface FtbStageTable {
    customWidths?: {
      label?: number;
      position?: number;
      points?: number;
      games?: number;
      chess?: number;
      name?: number;
      shortName?: number;
      fullName?: number;
      wdl?: number;
      wl?: number;
      winPercent?: number;
      gd?: number;
      form?: number;
    };
    /**
     * you can render only a LIMIT of rows. Component defines which rows to render base on "baseTeam" parameter. If base team not provided or not found, top of the table will be rendered
     */
    rowsLimit: { baseTeam?: Team; limit: number };
    showChess?: boolean;
    stage: Stage;
  }
  interface FtbStageTableStories {}
  interface FtbTabs {
    hideSingleTab: boolean;
    tabs: Array<{ renderTitle: () => string; renderContent: () => string }>;
  }
  interface FtbTeamLogo {
    /**
     * if  passed, component will callback color palette, defined for logo
     */
    extractColors?: (RGBs: Array<[number, number, number]>) => any;
    /**
     * If not defined, image resolution will be detected from on element size
     */
    mode?: 'min' | 'middle' | 'max';
    team: Team;
  }
  interface FtbTeamLogoStories {}
  interface FtbUserPhoto {
    lazy: boolean;
    user: User;
  }
  interface FtbUserPhotoStories {}
  interface FtbVideoCover {
    video: GameVideo;
  }
  interface FtbVideoCoverStories {}
  interface FtbVirtualScroll {
    itemHeightPx: number;
    items: any[];
    renderItem: (item: any) => string;
  }
  interface FtbVirtualScrollStories {}
}
declare global {
  interface HTMLFtbCodeSnippetElement extends Components.FtbCodeSnippet, HTMLStencilElement {}
  var HTMLFtbCodeSnippetElement: {
    prototype: HTMLFtbCodeSnippetElement;
    new (): HTMLFtbCodeSnippetElement;
  };
  interface HTMLFtbCupNetQuadraticElement extends Components.FtbCupNetQuadratic, HTMLStencilElement {}
  var HTMLFtbCupNetQuadraticElement: {
    prototype: HTMLFtbCupNetQuadraticElement;
    new (): HTMLFtbCupNetQuadraticElement;
  };
  interface HTMLFtbFlagElement extends Components.FtbFlag, HTMLStencilElement {}
  var HTMLFtbFlagElement: {
    prototype: HTMLFtbFlagElement;
    new (): HTMLFtbFlagElement;
  };
  interface HTMLFtbFlagStoriesElement extends Components.FtbFlagStories, HTMLStencilElement {}
  var HTMLFtbFlagStoriesElement: {
    prototype: HTMLFtbFlagStoriesElement;
    new (): HTMLFtbFlagStoriesElement;
  };
  interface HTMLFtbGameDateElement extends Components.FtbGameDate, HTMLStencilElement {}
  var HTMLFtbGameDateElement: {
    prototype: HTMLFtbGameDateElement;
    new (): HTMLFtbGameDateElement;
  };
  interface HTMLFtbGamePhotoGalleryElement extends Components.FtbGamePhotoGallery, HTMLStencilElement {}
  var HTMLFtbGamePhotoGalleryElement: {
    prototype: HTMLFtbGamePhotoGalleryElement;
    new (): HTMLFtbGamePhotoGalleryElement;
  };
  interface HTMLFtbGamePhotoGalleryStoriesElement extends Components.FtbGamePhotoGalleryStories, HTMLStencilElement {}
  var HTMLFtbGamePhotoGalleryStoriesElement: {
    prototype: HTMLFtbGamePhotoGalleryStoriesElement;
    new (): HTMLFtbGamePhotoGalleryStoriesElement;
  };
  interface HTMLFtbGameStateElement extends Components.FtbGameState, HTMLStencilElement {}
  var HTMLFtbGameStateElement: {
    prototype: HTMLFtbGameStateElement;
    new (): HTMLFtbGameStateElement;
  };
  interface HTMLFtbGameStateStoriesElement extends Components.FtbGameStateStories, HTMLStencilElement {}
  var HTMLFtbGameStateStoriesElement: {
    prototype: HTMLFtbGameStateStoriesElement;
    new (): HTMLFtbGameStateStoriesElement;
  };
  interface HTMLFtbGameTourElement extends Components.FtbGameTour, HTMLStencilElement {}
  var HTMLFtbGameTourElement: {
    prototype: HTMLFtbGameTourElement;
    new (): HTMLFtbGameTourElement;
  };
  interface HTMLFtbGameTourStoriesElement extends Components.FtbGameTourStories, HTMLStencilElement {}
  var HTMLFtbGameTourStoriesElement: {
    prototype: HTMLFtbGameTourStoriesElement;
    new (): HTMLFtbGameTourStoriesElement;
  };
  interface HTMLFtbGlobalSearchElement extends Components.FtbGlobalSearch, HTMLStencilElement {}
  var HTMLFtbGlobalSearchElement: {
    prototype: HTMLFtbGlobalSearchElement;
    new (): HTMLFtbGlobalSearchElement;
  };
  interface HTMLFtbIconElement extends Components.FtbIcon, HTMLStencilElement {}
  var HTMLFtbIconElement: {
    prototype: HTMLFtbIconElement;
    new (): HTMLFtbIconElement;
  };
  interface HTMLFtbIconStoriesElement extends Components.FtbIconStories, HTMLStencilElement {}
  var HTMLFtbIconStoriesElement: {
    prototype: HTMLFtbIconStoriesElement;
    new (): HTMLFtbIconStoriesElement;
  };
  interface HTMLFtbInfiniteScrollElement extends Components.FtbInfiniteScroll, HTMLStencilElement {}
  var HTMLFtbInfiniteScrollElement: {
    prototype: HTMLFtbInfiniteScrollElement;
    new (): HTMLFtbInfiniteScrollElement;
  };
  interface HTMLFtbInfiniteScrollStoriesElement extends Components.FtbInfiniteScrollStories, HTMLStencilElement {}
  var HTMLFtbInfiniteScrollStoriesElement: {
    prototype: HTMLFtbInfiniteScrollStoriesElement;
    new (): HTMLFtbInfiniteScrollStoriesElement;
  };
  interface HTMLFtbLeagueLogoElement extends Components.FtbLeagueLogo, HTMLStencilElement {}
  var HTMLFtbLeagueLogoElement: {
    prototype: HTMLFtbLeagueLogoElement;
    new (): HTMLFtbLeagueLogoElement;
  };
  interface HTMLFtbLeagueLogoStoriesElement extends Components.FtbLeagueLogoStories, HTMLStencilElement {}
  var HTMLFtbLeagueLogoStoriesElement: {
    prototype: HTMLFtbLeagueLogoStoriesElement;
    new (): HTMLFtbLeagueLogoStoriesElement;
  };
  interface HTMLFtbLeagueSportsIconElement extends Components.FtbLeagueSportsIcon, HTMLStencilElement {}
  var HTMLFtbLeagueSportsIconElement: {
    prototype: HTMLFtbLeagueSportsIconElement;
    new (): HTMLFtbLeagueSportsIconElement;
  };
  interface HTMLFtbLeagueSportsIconStoriesElement extends Components.FtbLeagueSportsIconStories, HTMLStencilElement {}
  var HTMLFtbLeagueSportsIconStoriesElement: {
    prototype: HTMLFtbLeagueSportsIconStoriesElement;
    new (): HTMLFtbLeagueSportsIconStoriesElement;
  };
  interface HTMLFtbLicenseAgreementElement extends Components.FtbLicenseAgreement, HTMLStencilElement {}
  var HTMLFtbLicenseAgreementElement: {
    prototype: HTMLFtbLicenseAgreementElement;
    new (): HTMLFtbLicenseAgreementElement;
  };
  interface HTMLFtbPaginationElement extends Components.FtbPagination, HTMLStencilElement {}
  var HTMLFtbPaginationElement: {
    prototype: HTMLFtbPaginationElement;
    new (): HTMLFtbPaginationElement;
  };
  interface HTMLFtbPaginationStoriesElement extends Components.FtbPaginationStories, HTMLStencilElement {}
  var HTMLFtbPaginationStoriesElement: {
    prototype: HTMLFtbPaginationStoriesElement;
    new (): HTMLFtbPaginationStoriesElement;
  };
  interface HTMLFtbPartnerBannerElement extends Components.FtbPartnerBanner, HTMLStencilElement {}
  var HTMLFtbPartnerBannerElement: {
    prototype: HTMLFtbPartnerBannerElement;
    new (): HTMLFtbPartnerBannerElement;
  };
  interface HTMLFtbPartnerBannerStoriesElement extends Components.FtbPartnerBannerStories, HTMLStencilElement {}
  var HTMLFtbPartnerBannerStoriesElement: {
    prototype: HTMLFtbPartnerBannerStoriesElement;
    new (): HTMLFtbPartnerBannerStoriesElement;
  };
  interface HTMLFtbPartnerPhotoElement extends Components.FtbPartnerPhoto, HTMLStencilElement {}
  var HTMLFtbPartnerPhotoElement: {
    prototype: HTMLFtbPartnerPhotoElement;
    new (): HTMLFtbPartnerPhotoElement;
  };
  interface HTMLFtbPartnerPhotoStoriesElement extends Components.FtbPartnerPhotoStories, HTMLStencilElement {}
  var HTMLFtbPartnerPhotoStoriesElement: {
    prototype: HTMLFtbPartnerPhotoStoriesElement;
    new (): HTMLFtbPartnerPhotoStoriesElement;
  };
  interface HTMLFtbPlayerPhotoElement extends Components.FtbPlayerPhoto, HTMLStencilElement {}
  var HTMLFtbPlayerPhotoElement: {
    prototype: HTMLFtbPlayerPhotoElement;
    new (): HTMLFtbPlayerPhotoElement;
  };
  interface HTMLFtbPlayerPhotoStoriesElement extends Components.FtbPlayerPhotoStories, HTMLStencilElement {}
  var HTMLFtbPlayerPhotoStoriesElement: {
    prototype: HTMLFtbPlayerPhotoStoriesElement;
    new (): HTMLFtbPlayerPhotoStoriesElement;
  };
  interface HTMLFtbPostBodyElement extends Components.FtbPostBody, HTMLStencilElement {}
  var HTMLFtbPostBodyElement: {
    prototype: HTMLFtbPostBodyElement;
    new (): HTMLFtbPostBodyElement;
  };
  interface HTMLFtbPostCoverElement extends Components.FtbPostCover, HTMLStencilElement {}
  var HTMLFtbPostCoverElement: {
    prototype: HTMLFtbPostCoverElement;
    new (): HTMLFtbPostCoverElement;
  };
  interface HTMLFtbPostPhotoElement extends Components.FtbPostPhoto, HTMLStencilElement {}
  var HTMLFtbPostPhotoElement: {
    prototype: HTMLFtbPostPhotoElement;
    new (): HTMLFtbPostPhotoElement;
  };
  interface HTMLFtbPostPhotoStoriesElement extends Components.FtbPostPhotoStories, HTMLStencilElement {}
  var HTMLFtbPostPhotoStoriesElement: {
    prototype: HTMLFtbPostPhotoStoriesElement;
    new (): HTMLFtbPostPhotoStoriesElement;
  };
  interface HTMLFtbSearchableContentElement extends Components.FtbSearchableContent, HTMLStencilElement {}
  var HTMLFtbSearchableContentElement: {
    prototype: HTMLFtbSearchableContentElement;
    new (): HTMLFtbSearchableContentElement;
  };
  interface HTMLFtbSearchableContentStoriesElement extends Components.FtbSearchableContentStories, HTMLStencilElement {}
  var HTMLFtbSearchableContentStoriesElement: {
    prototype: HTMLFtbSearchableContentStoriesElement;
    new (): HTMLFtbSearchableContentStoriesElement;
  };
  interface HTMLFtbShowcaseMainElement extends Components.FtbShowcaseMain, HTMLStencilElement {}
  var HTMLFtbShowcaseMainElement: {
    prototype: HTMLFtbShowcaseMainElement;
    new (): HTMLFtbShowcaseMainElement;
  };
  interface HTMLFtbShowcasePageElement extends Components.FtbShowcasePage, HTMLStencilElement {}
  var HTMLFtbShowcasePageElement: {
    prototype: HTMLFtbShowcasePageElement;
    new (): HTMLFtbShowcasePageElement;
  };
  interface HTMLFtbSpinnerElement extends Components.FtbSpinner, HTMLStencilElement {}
  var HTMLFtbSpinnerElement: {
    prototype: HTMLFtbSpinnerElement;
    new (): HTMLFtbSpinnerElement;
  };
  interface HTMLFtbSpinnerStoriesElement extends Components.FtbSpinnerStories, HTMLStencilElement {}
  var HTMLFtbSpinnerStoriesElement: {
    prototype: HTMLFtbSpinnerStoriesElement;
    new (): HTMLFtbSpinnerStoriesElement;
  };
  interface HTMLFtbStadiumPhotoElement extends Components.FtbStadiumPhoto, HTMLStencilElement {}
  var HTMLFtbStadiumPhotoElement: {
    prototype: HTMLFtbStadiumPhotoElement;
    new (): HTMLFtbStadiumPhotoElement;
  };
  interface HTMLFtbStadiumPhotoStoriesElement extends Components.FtbStadiumPhotoStories, HTMLStencilElement {}
  var HTMLFtbStadiumPhotoStoriesElement: {
    prototype: HTMLFtbStadiumPhotoStoriesElement;
    new (): HTMLFtbStadiumPhotoStoriesElement;
  };
  interface HTMLFtbStageCupNetElement extends Components.FtbStageCupNet, HTMLStencilElement {}
  var HTMLFtbStageCupNetElement: {
    prototype: HTMLFtbStageCupNetElement;
    new (): HTMLFtbStageCupNetElement;
  };
  interface HTMLFtbStageCupNetOldElement extends Components.FtbStageCupNetOld, HTMLStencilElement {}
  var HTMLFtbStageCupNetOldElement: {
    prototype: HTMLFtbStageCupNetOldElement;
    new (): HTMLFtbStageCupNetOldElement;
  };
  interface HTMLFtbStageCupNetStoriesElement extends Components.FtbStageCupNetStories, HTMLStencilElement {}
  var HTMLFtbStageCupNetStoriesElement: {
    prototype: HTMLFtbStageCupNetStoriesElement;
    new (): HTMLFtbStageCupNetStoriesElement;
  };
  interface HTMLFtbStageTableElement extends Components.FtbStageTable, HTMLStencilElement {}
  var HTMLFtbStageTableElement: {
    prototype: HTMLFtbStageTableElement;
    new (): HTMLFtbStageTableElement;
  };
  interface HTMLFtbStageTableStoriesElement extends Components.FtbStageTableStories, HTMLStencilElement {}
  var HTMLFtbStageTableStoriesElement: {
    prototype: HTMLFtbStageTableStoriesElement;
    new (): HTMLFtbStageTableStoriesElement;
  };
  interface HTMLFtbTabsElement extends Components.FtbTabs, HTMLStencilElement {}
  var HTMLFtbTabsElement: {
    prototype: HTMLFtbTabsElement;
    new (): HTMLFtbTabsElement;
  };
  interface HTMLFtbTeamLogoElement extends Components.FtbTeamLogo, HTMLStencilElement {}
  var HTMLFtbTeamLogoElement: {
    prototype: HTMLFtbTeamLogoElement;
    new (): HTMLFtbTeamLogoElement;
  };
  interface HTMLFtbTeamLogoStoriesElement extends Components.FtbTeamLogoStories, HTMLStencilElement {}
  var HTMLFtbTeamLogoStoriesElement: {
    prototype: HTMLFtbTeamLogoStoriesElement;
    new (): HTMLFtbTeamLogoStoriesElement;
  };
  interface HTMLFtbUserPhotoElement extends Components.FtbUserPhoto, HTMLStencilElement {}
  var HTMLFtbUserPhotoElement: {
    prototype: HTMLFtbUserPhotoElement;
    new (): HTMLFtbUserPhotoElement;
  };
  interface HTMLFtbUserPhotoStoriesElement extends Components.FtbUserPhotoStories, HTMLStencilElement {}
  var HTMLFtbUserPhotoStoriesElement: {
    prototype: HTMLFtbUserPhotoStoriesElement;
    new (): HTMLFtbUserPhotoStoriesElement;
  };
  interface HTMLFtbVideoCoverElement extends Components.FtbVideoCover, HTMLStencilElement {}
  var HTMLFtbVideoCoverElement: {
    prototype: HTMLFtbVideoCoverElement;
    new (): HTMLFtbVideoCoverElement;
  };
  interface HTMLFtbVideoCoverStoriesElement extends Components.FtbVideoCoverStories, HTMLStencilElement {}
  var HTMLFtbVideoCoverStoriesElement: {
    prototype: HTMLFtbVideoCoverStoriesElement;
    new (): HTMLFtbVideoCoverStoriesElement;
  };
  interface HTMLFtbVirtualScrollElement extends Components.FtbVirtualScroll, HTMLStencilElement {}
  var HTMLFtbVirtualScrollElement: {
    prototype: HTMLFtbVirtualScrollElement;
    new (): HTMLFtbVirtualScrollElement;
  };
  interface HTMLFtbVirtualScrollStoriesElement extends Components.FtbVirtualScrollStories, HTMLStencilElement {}
  var HTMLFtbVirtualScrollStoriesElement: {
    prototype: HTMLFtbVirtualScrollStoriesElement;
    new (): HTMLFtbVirtualScrollStoriesElement;
  };
  interface HTMLElementTagNameMap {
    'ftb-code-snippet': HTMLFtbCodeSnippetElement;
    'ftb-cup-net-quadratic': HTMLFtbCupNetQuadraticElement;
    'ftb-flag': HTMLFtbFlagElement;
    'ftb-flag-stories': HTMLFtbFlagStoriesElement;
    'ftb-game-date': HTMLFtbGameDateElement;
    'ftb-game-photo-gallery': HTMLFtbGamePhotoGalleryElement;
    'ftb-game-photo-gallery-stories': HTMLFtbGamePhotoGalleryStoriesElement;
    'ftb-game-state': HTMLFtbGameStateElement;
    'ftb-game-state-stories': HTMLFtbGameStateStoriesElement;
    'ftb-game-tour': HTMLFtbGameTourElement;
    'ftb-game-tour-stories': HTMLFtbGameTourStoriesElement;
    'ftb-global-search': HTMLFtbGlobalSearchElement;
    'ftb-icon': HTMLFtbIconElement;
    'ftb-icon-stories': HTMLFtbIconStoriesElement;
    'ftb-infinite-scroll': HTMLFtbInfiniteScrollElement;
    'ftb-infinite-scroll-stories': HTMLFtbInfiniteScrollStoriesElement;
    'ftb-league-logo': HTMLFtbLeagueLogoElement;
    'ftb-league-logo-stories': HTMLFtbLeagueLogoStoriesElement;
    'ftb-league-sports-icon': HTMLFtbLeagueSportsIconElement;
    'ftb-league-sports-icon-stories': HTMLFtbLeagueSportsIconStoriesElement;
    'ftb-license-agreement': HTMLFtbLicenseAgreementElement;
    'ftb-pagination': HTMLFtbPaginationElement;
    'ftb-pagination-stories': HTMLFtbPaginationStoriesElement;
    'ftb-partner-banner': HTMLFtbPartnerBannerElement;
    'ftb-partner-banner-stories': HTMLFtbPartnerBannerStoriesElement;
    'ftb-partner-photo': HTMLFtbPartnerPhotoElement;
    'ftb-partner-photo-stories': HTMLFtbPartnerPhotoStoriesElement;
    'ftb-player-photo': HTMLFtbPlayerPhotoElement;
    'ftb-player-photo-stories': HTMLFtbPlayerPhotoStoriesElement;
    'ftb-post-body': HTMLFtbPostBodyElement;
    'ftb-post-cover': HTMLFtbPostCoverElement;
    'ftb-post-photo': HTMLFtbPostPhotoElement;
    'ftb-post-photo-stories': HTMLFtbPostPhotoStoriesElement;
    'ftb-searchable-content': HTMLFtbSearchableContentElement;
    'ftb-searchable-content-stories': HTMLFtbSearchableContentStoriesElement;
    'ftb-showcase-main': HTMLFtbShowcaseMainElement;
    'ftb-showcase-page': HTMLFtbShowcasePageElement;
    'ftb-spinner': HTMLFtbSpinnerElement;
    'ftb-spinner-stories': HTMLFtbSpinnerStoriesElement;
    'ftb-stadium-photo': HTMLFtbStadiumPhotoElement;
    'ftb-stadium-photo-stories': HTMLFtbStadiumPhotoStoriesElement;
    'ftb-stage-cup-net': HTMLFtbStageCupNetElement;
    'ftb-stage-cup-net-old': HTMLFtbStageCupNetOldElement;
    'ftb-stage-cup-net-stories': HTMLFtbStageCupNetStoriesElement;
    'ftb-stage-table': HTMLFtbStageTableElement;
    'ftb-stage-table-stories': HTMLFtbStageTableStoriesElement;
    'ftb-tabs': HTMLFtbTabsElement;
    'ftb-team-logo': HTMLFtbTeamLogoElement;
    'ftb-team-logo-stories': HTMLFtbTeamLogoStoriesElement;
    'ftb-user-photo': HTMLFtbUserPhotoElement;
    'ftb-user-photo-stories': HTMLFtbUserPhotoStoriesElement;
    'ftb-video-cover': HTMLFtbVideoCoverElement;
    'ftb-video-cover-stories': HTMLFtbVideoCoverStoriesElement;
    'ftb-virtual-scroll': HTMLFtbVirtualScrollElement;
    'ftb-virtual-scroll-stories': HTMLFtbVirtualScrollStoriesElement;
  }
}
declare namespace LocalJSX {
  interface FtbCodeSnippet {
    code?: string;
    language?: string;
  }
  interface FtbCupNetQuadratic {
    /**
     * team to highlight on the net with color
     */
    highlightTeam?: Team;
    stage: Stage;
  }
  interface FtbFlag {
    /**
     * if  passed, component will callback color palette, defined for flag
     */
    extractColors?: (RGBs: Array<[number, number, number]>) => any;
    flag: string;
  }
  interface FtbFlagStories {}
  interface FtbGameDate {
    game: Game;
    withtime?: boolean;
  }
  interface FtbGamePhotoGallery {
    game: Game;
  }
  interface FtbGamePhotoGalleryStories {
    prefetchMode?: boolean;
  }
  interface FtbGameState {
    game: Game;
  }
  interface FtbGameStateStories {}
  interface FtbGameTour {
    game: Game;
  }
  interface FtbGameTourStories {}
  interface FtbGlobalSearch {}
  interface FtbIcon {
    svg: string;
  }
  interface FtbIconStories {}
  interface FtbInfiniteScroll {
    /**
     * method that is called when user scrolls to a component
     */
    loadData: () => Promise<any>;
  }
  interface FtbInfiniteScrollStories {}
  interface FtbLeagueLogo {
    league: League;
  }
  interface FtbLeagueLogoStories {}
  interface FtbLeagueSportsIcon {
    league: League;
  }
  interface FtbLeagueSportsIconStories {}
  interface FtbLicenseAgreement {
    license: LicenseAgreement;
  }
  interface FtbPagination {
    /**
     * number of items per each page
     */
    itemsPerPage: number;
    /**
     * render function for items chunk
     */
    renderPage: (fromIdx, toIdx) => string | string[];
    /**
     * total items
     */
    totalItems: number;
  }
  interface FtbPaginationStories {}
  interface FtbPartnerBanner {}
  interface FtbPartnerBannerStories {}
  interface FtbPartnerPhoto {
    partner: Partner;
  }
  interface FtbPartnerPhotoStories {}
  interface FtbPlayerPhoto {
    lazy?: boolean;
    player: Player;
  }
  interface FtbPlayerPhotoStories {}
  interface FtbPostBody {
    post: Post;
  }
  interface FtbPostCover {
    post: Post;
  }
  interface FtbPostPhoto {
    /**
     * If not defined, image resolution will be detected from on element size
     */
    mode?: 'min' | 'middle' | 'max';
    post: Post;
  }
  interface FtbPostPhotoStories {}
  interface FtbSearchableContent {
    categories?: CategoryInterface[];
    clear?: number;
    debounce?: number;
    filterFn: (items: any[], query: string, categories?: CategoryInterface[]) => Promise<any[]>;
    /**
     * alternative to "categories" property. used when categories list should be updated on category change
     */
    getCategories?: (currentCategories?: CategoryInterface[]) => CategoryInterface[];
    items: any[];
    onInputFocusChange?: (event: CustomEvent<boolean>) => void;
    onInputKeyDown?: (event: CustomEvent<KeyboardEvent>) => void;
    onOpenCategoryChange?: (event: CustomEvent<CategoryInterface>) => void;
    onSearchInProgressCategoryChange?: (event: CustomEvent<boolean>) => void;
    placeholder?: string;
    renderItems: (items: any[]) => string | string[];
  }
  interface FtbSearchableContentStories {}
  interface FtbShowcaseMain {}
  interface FtbShowcasePage {}
  interface FtbSpinner {}
  interface FtbSpinnerStories {}
  interface FtbStadiumPhoto {
    lazy?: boolean;
    stadium: Stadium;
  }
  interface FtbStadiumPhotoStories {}
  interface FtbStageCupNet {
    highlightTeam?: Team;
    stage: Stage;
  }
  interface FtbStageCupNetOld {
    stage: Stage;
  }
  interface FtbStageCupNetStories {}
  interface FtbStageTable {
    customWidths?: {
      label?: number;
      position?: number;
      points?: number;
      games?: number;
      chess?: number;
      name?: number;
      shortName?: number;
      fullName?: number;
      wdl?: number;
      wl?: number;
      winPercent?: number;
      gd?: number;
      form?: number;
    };
    /**
     * you can render only a LIMIT of rows. Component defines which rows to render base on "baseTeam" parameter. If base team not provided or not found, top of the table will be rendered
     */
    rowsLimit?: { baseTeam?: Team; limit: number };
    showChess?: boolean;
    stage: Stage;
  }
  interface FtbStageTableStories {}
  interface FtbTabs {
    hideSingleTab?: boolean;
    tabs: Array<{ renderTitle: () => string; renderContent: () => string }>;
  }
  interface FtbTeamLogo {
    /**
     * if  passed, component will callback color palette, defined for logo
     */
    extractColors?: (RGBs: Array<[number, number, number]>) => any;
    /**
     * If not defined, image resolution will be detected from on element size
     */
    mode?: 'min' | 'middle' | 'max';
    team: Team;
  }
  interface FtbTeamLogoStories {}
  interface FtbUserPhoto {
    lazy?: boolean;
    user: User;
  }
  interface FtbUserPhotoStories {}
  interface FtbVideoCover {
    video: GameVideo;
  }
  interface FtbVideoCoverStories {}
  interface FtbVirtualScroll {
    itemHeightPx: number;
    items: any[];
    renderItem: (item: any) => string;
  }
  interface FtbVirtualScrollStories {}
  interface IntrinsicElements {
    'ftb-code-snippet': FtbCodeSnippet;
    'ftb-cup-net-quadratic': FtbCupNetQuadratic;
    'ftb-flag': FtbFlag;
    'ftb-flag-stories': FtbFlagStories;
    'ftb-game-date': FtbGameDate;
    'ftb-game-photo-gallery': FtbGamePhotoGallery;
    'ftb-game-photo-gallery-stories': FtbGamePhotoGalleryStories;
    'ftb-game-state': FtbGameState;
    'ftb-game-state-stories': FtbGameStateStories;
    'ftb-game-tour': FtbGameTour;
    'ftb-game-tour-stories': FtbGameTourStories;
    'ftb-global-search': FtbGlobalSearch;
    'ftb-icon': FtbIcon;
    'ftb-icon-stories': FtbIconStories;
    'ftb-infinite-scroll': FtbInfiniteScroll;
    'ftb-infinite-scroll-stories': FtbInfiniteScrollStories;
    'ftb-league-logo': FtbLeagueLogo;
    'ftb-league-logo-stories': FtbLeagueLogoStories;
    'ftb-league-sports-icon': FtbLeagueSportsIcon;
    'ftb-league-sports-icon-stories': FtbLeagueSportsIconStories;
    'ftb-license-agreement': FtbLicenseAgreement;
    'ftb-pagination': FtbPagination;
    'ftb-pagination-stories': FtbPaginationStories;
    'ftb-partner-banner': FtbPartnerBanner;
    'ftb-partner-banner-stories': FtbPartnerBannerStories;
    'ftb-partner-photo': FtbPartnerPhoto;
    'ftb-partner-photo-stories': FtbPartnerPhotoStories;
    'ftb-player-photo': FtbPlayerPhoto;
    'ftb-player-photo-stories': FtbPlayerPhotoStories;
    'ftb-post-body': FtbPostBody;
    'ftb-post-cover': FtbPostCover;
    'ftb-post-photo': FtbPostPhoto;
    'ftb-post-photo-stories': FtbPostPhotoStories;
    'ftb-searchable-content': FtbSearchableContent;
    'ftb-searchable-content-stories': FtbSearchableContentStories;
    'ftb-showcase-main': FtbShowcaseMain;
    'ftb-showcase-page': FtbShowcasePage;
    'ftb-spinner': FtbSpinner;
    'ftb-spinner-stories': FtbSpinnerStories;
    'ftb-stadium-photo': FtbStadiumPhoto;
    'ftb-stadium-photo-stories': FtbStadiumPhotoStories;
    'ftb-stage-cup-net': FtbStageCupNet;
    'ftb-stage-cup-net-old': FtbStageCupNetOld;
    'ftb-stage-cup-net-stories': FtbStageCupNetStories;
    'ftb-stage-table': FtbStageTable;
    'ftb-stage-table-stories': FtbStageTableStories;
    'ftb-tabs': FtbTabs;
    'ftb-team-logo': FtbTeamLogo;
    'ftb-team-logo-stories': FtbTeamLogoStories;
    'ftb-user-photo': FtbUserPhoto;
    'ftb-user-photo-stories': FtbUserPhotoStories;
    'ftb-video-cover': FtbVideoCover;
    'ftb-video-cover-stories': FtbVideoCoverStories;
    'ftb-virtual-scroll': FtbVirtualScroll;
    'ftb-virtual-scroll-stories': FtbVirtualScrollStories;
  }
}
export { LocalJSX as JSX };
declare module '@stencil/core' {
  export namespace JSX {
    interface IntrinsicElements {
      'ftb-code-snippet': LocalJSX.FtbCodeSnippet & JSXBase.HTMLAttributes<HTMLFtbCodeSnippetElement>;
      'ftb-cup-net-quadratic': LocalJSX.FtbCupNetQuadratic & JSXBase.HTMLAttributes<HTMLFtbCupNetQuadraticElement>;
      'ftb-flag': LocalJSX.FtbFlag & JSXBase.HTMLAttributes<HTMLFtbFlagElement>;
      'ftb-flag-stories': LocalJSX.FtbFlagStories & JSXBase.HTMLAttributes<HTMLFtbFlagStoriesElement>;
      'ftb-game-date': LocalJSX.FtbGameDate & JSXBase.HTMLAttributes<HTMLFtbGameDateElement>;
      'ftb-game-photo-gallery': LocalJSX.FtbGamePhotoGallery & JSXBase.HTMLAttributes<HTMLFtbGamePhotoGalleryElement>;
      'ftb-game-photo-gallery-stories': LocalJSX.FtbGamePhotoGalleryStories &
        JSXBase.HTMLAttributes<HTMLFtbGamePhotoGalleryStoriesElement>;
      'ftb-game-state': LocalJSX.FtbGameState & JSXBase.HTMLAttributes<HTMLFtbGameStateElement>;
      'ftb-game-state-stories': LocalJSX.FtbGameStateStories & JSXBase.HTMLAttributes<HTMLFtbGameStateStoriesElement>;
      'ftb-game-tour': LocalJSX.FtbGameTour & JSXBase.HTMLAttributes<HTMLFtbGameTourElement>;
      'ftb-game-tour-stories': LocalJSX.FtbGameTourStories & JSXBase.HTMLAttributes<HTMLFtbGameTourStoriesElement>;
      'ftb-global-search': LocalJSX.FtbGlobalSearch & JSXBase.HTMLAttributes<HTMLFtbGlobalSearchElement>;
      'ftb-icon': LocalJSX.FtbIcon & JSXBase.HTMLAttributes<HTMLFtbIconElement>;
      'ftb-icon-stories': LocalJSX.FtbIconStories & JSXBase.HTMLAttributes<HTMLFtbIconStoriesElement>;
      'ftb-infinite-scroll': LocalJSX.FtbInfiniteScroll & JSXBase.HTMLAttributes<HTMLFtbInfiniteScrollElement>;
      'ftb-infinite-scroll-stories': LocalJSX.FtbInfiniteScrollStories &
        JSXBase.HTMLAttributes<HTMLFtbInfiniteScrollStoriesElement>;
      'ftb-league-logo': LocalJSX.FtbLeagueLogo & JSXBase.HTMLAttributes<HTMLFtbLeagueLogoElement>;
      'ftb-league-logo-stories': LocalJSX.FtbLeagueLogoStories &
        JSXBase.HTMLAttributes<HTMLFtbLeagueLogoStoriesElement>;
      'ftb-league-sports-icon': LocalJSX.FtbLeagueSportsIcon & JSXBase.HTMLAttributes<HTMLFtbLeagueSportsIconElement>;
      'ftb-league-sports-icon-stories': LocalJSX.FtbLeagueSportsIconStories &
        JSXBase.HTMLAttributes<HTMLFtbLeagueSportsIconStoriesElement>;
      'ftb-license-agreement': LocalJSX.FtbLicenseAgreement & JSXBase.HTMLAttributes<HTMLFtbLicenseAgreementElement>;
      'ftb-pagination': LocalJSX.FtbPagination & JSXBase.HTMLAttributes<HTMLFtbPaginationElement>;
      'ftb-pagination-stories': LocalJSX.FtbPaginationStories & JSXBase.HTMLAttributes<HTMLFtbPaginationStoriesElement>;
      'ftb-partner-banner': LocalJSX.FtbPartnerBanner & JSXBase.HTMLAttributes<HTMLFtbPartnerBannerElement>;
      'ftb-partner-banner-stories': LocalJSX.FtbPartnerBannerStories &
        JSXBase.HTMLAttributes<HTMLFtbPartnerBannerStoriesElement>;
      'ftb-partner-photo': LocalJSX.FtbPartnerPhoto & JSXBase.HTMLAttributes<HTMLFtbPartnerPhotoElement>;
      'ftb-partner-photo-stories': LocalJSX.FtbPartnerPhotoStories &
        JSXBase.HTMLAttributes<HTMLFtbPartnerPhotoStoriesElement>;
      'ftb-player-photo': LocalJSX.FtbPlayerPhoto & JSXBase.HTMLAttributes<HTMLFtbPlayerPhotoElement>;
      'ftb-player-photo-stories': LocalJSX.FtbPlayerPhotoStories &
        JSXBase.HTMLAttributes<HTMLFtbPlayerPhotoStoriesElement>;
      'ftb-post-body': LocalJSX.FtbPostBody & JSXBase.HTMLAttributes<HTMLFtbPostBodyElement>;
      'ftb-post-cover': LocalJSX.FtbPostCover & JSXBase.HTMLAttributes<HTMLFtbPostCoverElement>;
      'ftb-post-photo': LocalJSX.FtbPostPhoto & JSXBase.HTMLAttributes<HTMLFtbPostPhotoElement>;
      'ftb-post-photo-stories': LocalJSX.FtbPostPhotoStories & JSXBase.HTMLAttributes<HTMLFtbPostPhotoStoriesElement>;
      'ftb-searchable-content': LocalJSX.FtbSearchableContent & JSXBase.HTMLAttributes<HTMLFtbSearchableContentElement>;
      'ftb-searchable-content-stories': LocalJSX.FtbSearchableContentStories &
        JSXBase.HTMLAttributes<HTMLFtbSearchableContentStoriesElement>;
      'ftb-showcase-main': LocalJSX.FtbShowcaseMain & JSXBase.HTMLAttributes<HTMLFtbShowcaseMainElement>;
      'ftb-showcase-page': LocalJSX.FtbShowcasePage & JSXBase.HTMLAttributes<HTMLFtbShowcasePageElement>;
      'ftb-spinner': LocalJSX.FtbSpinner & JSXBase.HTMLAttributes<HTMLFtbSpinnerElement>;
      'ftb-spinner-stories': LocalJSX.FtbSpinnerStories & JSXBase.HTMLAttributes<HTMLFtbSpinnerStoriesElement>;
      'ftb-stadium-photo': LocalJSX.FtbStadiumPhoto & JSXBase.HTMLAttributes<HTMLFtbStadiumPhotoElement>;
      'ftb-stadium-photo-stories': LocalJSX.FtbStadiumPhotoStories &
        JSXBase.HTMLAttributes<HTMLFtbStadiumPhotoStoriesElement>;
      'ftb-stage-cup-net': LocalJSX.FtbStageCupNet & JSXBase.HTMLAttributes<HTMLFtbStageCupNetElement>;
      'ftb-stage-cup-net-old': LocalJSX.FtbStageCupNetOld & JSXBase.HTMLAttributes<HTMLFtbStageCupNetOldElement>;
      'ftb-stage-cup-net-stories': LocalJSX.FtbStageCupNetStories &
        JSXBase.HTMLAttributes<HTMLFtbStageCupNetStoriesElement>;
      'ftb-stage-table': LocalJSX.FtbStageTable & JSXBase.HTMLAttributes<HTMLFtbStageTableElement>;
      'ftb-stage-table-stories': LocalJSX.FtbStageTableStories &
        JSXBase.HTMLAttributes<HTMLFtbStageTableStoriesElement>;
      'ftb-tabs': LocalJSX.FtbTabs & JSXBase.HTMLAttributes<HTMLFtbTabsElement>;
      'ftb-team-logo': LocalJSX.FtbTeamLogo & JSXBase.HTMLAttributes<HTMLFtbTeamLogoElement>;
      'ftb-team-logo-stories': LocalJSX.FtbTeamLogoStories & JSXBase.HTMLAttributes<HTMLFtbTeamLogoStoriesElement>;
      'ftb-user-photo': LocalJSX.FtbUserPhoto & JSXBase.HTMLAttributes<HTMLFtbUserPhotoElement>;
      'ftb-user-photo-stories': LocalJSX.FtbUserPhotoStories & JSXBase.HTMLAttributes<HTMLFtbUserPhotoStoriesElement>;
      'ftb-video-cover': LocalJSX.FtbVideoCover & JSXBase.HTMLAttributes<HTMLFtbVideoCoverElement>;
      'ftb-video-cover-stories': LocalJSX.FtbVideoCoverStories &
        JSXBase.HTMLAttributes<HTMLFtbVideoCoverStoriesElement>;
      'ftb-virtual-scroll': LocalJSX.FtbVirtualScroll & JSXBase.HTMLAttributes<HTMLFtbVirtualScrollElement>;
      'ftb-virtual-scroll-stories': LocalJSX.FtbVirtualScrollStories &
        JSXBase.HTMLAttributes<HTMLFtbVirtualScrollStoriesElement>;
    }
  }
}
