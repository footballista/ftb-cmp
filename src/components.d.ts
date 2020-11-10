/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { FtbTeamLogoMode } from "./components/ftb-team-logo/ftb-team-logo-mode";
import { Team } from "ftb-models/dist/models/team.model";
export namespace Components {
    interface FtbIcon {
        "svg": string;
    }
    interface FtbImg {
        "name": string;
        "src": string;
    }
    interface FtbTeamLogo {
        "logo": string;
        "mode": FtbTeamLogoMode;
        "name": string;
        "team": Team;
        "version": number;
    }
}
declare global {
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
    interface HTMLFtbTeamLogoElement extends Components.FtbTeamLogo, HTMLStencilElement {
    }
    var HTMLFtbTeamLogoElement: {
        prototype: HTMLFtbTeamLogoElement;
        new (): HTMLFtbTeamLogoElement;
    };
    interface HTMLElementTagNameMap {
        "ftb-icon": HTMLFtbIconElement;
        "ftb-img": HTMLFtbImgElement;
        "ftb-team-logo": HTMLFtbTeamLogoElement;
    }
}
declare namespace LocalJSX {
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
    interface FtbTeamLogo {
        "logo"?: string;
        "mode"?: FtbTeamLogoMode;
        "name"?: string;
        "team"?: Team;
        "version"?: number;
    }
    interface IntrinsicElements {
        "ftb-icon": FtbIcon;
        "ftb-img": FtbImg;
        "ftb-team-logo": FtbTeamLogo;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ftb-icon": LocalJSX.FtbIcon & JSXBase.HTMLAttributes<HTMLFtbIconElement>;
            "ftb-img": LocalJSX.FtbImg & JSXBase.HTMLAttributes<HTMLFtbImgElement>;
            "ftb-team-logo": LocalJSX.FtbTeamLogo & JSXBase.HTMLAttributes<HTMLFtbTeamLogoElement>;
        }
    }
}
