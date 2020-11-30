/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Player } from "ftb-models/dist/models/player.model";
import { FtbTeamLogoMode } from "./components/ftb-team-logo/ftb-team-logo-mode";
import { Team } from "ftb-models/dist/models/team.model";
import { User } from "ftb-models/dist/models/user.model";
export namespace Components {
    interface CmpShowcase {
    }
    interface FtbAlertsFeed {
    }
    interface FtbIcon {
        "svg": string;
    }
    interface FtbImg {
        "name": string;
        "src": string;
    }
    interface FtbImprovingImg {
        "sources": string[];
    }
    interface FtbPagination {
        "itemHeightPx": number;
        "itemMinWidthPx": number;
        "items": any[];
        "renderItem": (item) => string;
        "rows": number;
    }
    interface FtbPlayerPhoto {
        "player": Player;
        "playerId": number;
        "version": number;
    }
    interface FtbTeamLogo {
        "logo": string;
        "mode": FtbTeamLogoMode;
        "name": string;
        "team": Team;
        "version": number;
    }
    interface FtbUserPhoto {
        "user": User;
        "userId": number;
        "version": number;
    }
}
declare global {
    interface HTMLCmpShowcaseElement extends Components.CmpShowcase, HTMLStencilElement {
    }
    var HTMLCmpShowcaseElement: {
        prototype: HTMLCmpShowcaseElement;
        new (): HTMLCmpShowcaseElement;
    };
    interface HTMLFtbAlertsFeedElement extends Components.FtbAlertsFeed, HTMLStencilElement {
    }
    var HTMLFtbAlertsFeedElement: {
        prototype: HTMLFtbAlertsFeedElement;
        new (): HTMLFtbAlertsFeedElement;
    };
    interface HTMLFtbIconElement extends Components.FtbIcon, HTMLStencilElement {
    }
    var HTMLFtbIconElement: {
        prototype: HTMLFtbIconElement;
        new (): HTMLFtbIconElement;
    };
    interface HTMLFtbImgElement extends Components.FtbImg, HTMLStencilElement {
    }
    var HTMLFtbImgElement: {
        prototype: HTMLFtbImgElement;
        new (): HTMLFtbImgElement;
    };
    interface HTMLFtbImprovingImgElement extends Components.FtbImprovingImg, HTMLStencilElement {
    }
    var HTMLFtbImprovingImgElement: {
        prototype: HTMLFtbImprovingImgElement;
        new (): HTMLFtbImprovingImgElement;
    };
    interface HTMLFtbPaginationElement extends Components.FtbPagination, HTMLStencilElement {
    }
    var HTMLFtbPaginationElement: {
        prototype: HTMLFtbPaginationElement;
        new (): HTMLFtbPaginationElement;
    };
    interface HTMLFtbPlayerPhotoElement extends Components.FtbPlayerPhoto, HTMLStencilElement {
    }
    var HTMLFtbPlayerPhotoElement: {
        prototype: HTMLFtbPlayerPhotoElement;
        new (): HTMLFtbPlayerPhotoElement;
    };
    interface HTMLFtbTeamLogoElement extends Components.FtbTeamLogo, HTMLStencilElement {
    }
    var HTMLFtbTeamLogoElement: {
        prototype: HTMLFtbTeamLogoElement;
        new (): HTMLFtbTeamLogoElement;
    };
    interface HTMLFtbUserPhotoElement extends Components.FtbUserPhoto, HTMLStencilElement {
    }
    var HTMLFtbUserPhotoElement: {
        prototype: HTMLFtbUserPhotoElement;
        new (): HTMLFtbUserPhotoElement;
    };
    interface HTMLElementTagNameMap {
        "cmp-showcase": HTMLCmpShowcaseElement;
        "ftb-alerts-feed": HTMLFtbAlertsFeedElement;
        "ftb-icon": HTMLFtbIconElement;
        "ftb-img": HTMLFtbImgElement;
        "ftb-improving-img": HTMLFtbImprovingImgElement;
        "ftb-pagination": HTMLFtbPaginationElement;
        "ftb-player-photo": HTMLFtbPlayerPhotoElement;
        "ftb-team-logo": HTMLFtbTeamLogoElement;
        "ftb-user-photo": HTMLFtbUserPhotoElement;
    }
}
declare namespace LocalJSX {
    interface CmpShowcase {
    }
    interface FtbAlertsFeed {
    }
    interface FtbIcon {
        "svg": string;
    }
    interface FtbImg {
        "name"?: string;
        "onColor"?: (event: CustomEvent<[number, number, number]>) => void;
        "onFailed"?: (event: CustomEvent<boolean>) => void;
        "onLoaded"?: (event: CustomEvent<boolean>) => void;
        "src": string;
    }
    interface FtbImprovingImg {
        "sources": string[];
    }
    interface FtbPagination {
        "itemHeightPx": number;
        "itemMinWidthPx": number;
        "items": any[];
        "renderItem": (item) => string;
        "rows": number;
    }
    interface FtbPlayerPhoto {
        "player"?: Player;
        "playerId"?: number;
        "version"?: number;
    }
    interface FtbTeamLogo {
        "logo"?: string;
        "mode"?: FtbTeamLogoMode;
        "name"?: string;
        "team"?: Team;
        "version"?: number;
    }
    interface FtbUserPhoto {
        "user"?: User;
        "userId"?: number;
        "version"?: number;
    }
    interface IntrinsicElements {
        "cmp-showcase": CmpShowcase;
        "ftb-alerts-feed": FtbAlertsFeed;
        "ftb-icon": FtbIcon;
        "ftb-img": FtbImg;
        "ftb-improving-img": FtbImprovingImg;
        "ftb-pagination": FtbPagination;
        "ftb-player-photo": FtbPlayerPhoto;
        "ftb-team-logo": FtbTeamLogo;
        "ftb-user-photo": FtbUserPhoto;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "cmp-showcase": LocalJSX.CmpShowcase & JSXBase.HTMLAttributes<HTMLCmpShowcaseElement>;
            "ftb-alerts-feed": LocalJSX.FtbAlertsFeed & JSXBase.HTMLAttributes<HTMLFtbAlertsFeedElement>;
            "ftb-icon": LocalJSX.FtbIcon & JSXBase.HTMLAttributes<HTMLFtbIconElement>;
            "ftb-img": LocalJSX.FtbImg & JSXBase.HTMLAttributes<HTMLFtbImgElement>;
            "ftb-improving-img": LocalJSX.FtbImprovingImg & JSXBase.HTMLAttributes<HTMLFtbImprovingImgElement>;
            "ftb-pagination": LocalJSX.FtbPagination & JSXBase.HTMLAttributes<HTMLFtbPaginationElement>;
            "ftb-player-photo": LocalJSX.FtbPlayerPhoto & JSXBase.HTMLAttributes<HTMLFtbPlayerPhotoElement>;
            "ftb-team-logo": LocalJSX.FtbTeamLogo & JSXBase.HTMLAttributes<HTMLFtbTeamLogoElement>;
            "ftb-user-photo": LocalJSX.FtbUserPhoto & JSXBase.HTMLAttributes<HTMLFtbUserPhotoElement>;
        }
    }
}
