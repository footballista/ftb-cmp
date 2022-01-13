import { Component, Host, h, Prop, State, Element, writeTask } from '@stencil/core';
import {checkElementSize, envState, Team} from 'ftb-models';
import ShieldIcon from '../../assets/icons/shield.svg';

const MIDDLE_SIZE_THRESHOLD = 50;
const MAX_SIZE_THRESHOLD = 200;

/**
 * Renders team logo based on team model
 */
@Component({
  tag: 'ftb-team-logo',
  styleUrl: 'ftb-team-logo.component.scss',
  shadow: false,
})
export class FtbTeamLogo {
  @Prop() team!: Team;
  /** if  passed, component will callback color palette, defined for logo */
  @Prop() extractColors?: (RGBs: Array<[number, number, number]>) => any;

  /** If not defined, image resolution will be detected from on element size */
  @Prop() mode?: 'min' | 'middle' | 'max';

  /** Image loading failed (possibly logo does not exist on server), showing default placeholder */
  @State() showPlaceholder: boolean = false;

  @Element() el: HTMLFtbTeamLogoElement;

  getPalette: (el: HTMLImageElement) => Array<[number, number, number]>;

  async connectedCallback() {
    if (!this.team) return;

    const appendImg = (size: 'middle' | 'max') => {
      const pic = document.createElement('picture');
      const source = document.createElement('source');
      const img = document.createElement('img');
      pic.append(source, img);
      source.srcset = size == 'middle' ? this.url('middle') + ', ' + this.url('max') + ' 2x' : this.url('max');
      img.src = size == 'middle' ? this.url('middle', 'png') : this.url('max', 'png');
      img.onload = () => writeTask(() => this.el.append(pic));
    };

    if (this.mode == 'middle') {
      appendImg('middle');
    } else if (this.mode == 'max') {
      appendImg('max');
    } else if (!this.mode) {
      checkElementSize(this.el).then(({ width }) => {
        if (width > MAX_SIZE_THRESHOLD) {
          appendImg('max');
        } else if (width > MIDDLE_SIZE_THRESHOLD) {
          appendImg('middle');
        }
      });
    }

    if (this.el['extractColors']) {
      this.getPalette = (await import('colorthief')).default.prototype.getPalette;
    }
  }

  url(size: 'min' | 'middle' | 'max', format: 'webp' | 'png' = 'png') {
    return envState.imgHost + `img/logos/${this.team.logo}-` + size + '.' + format + `?logoId=${this.team.logoId}`;
  }

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  onMinImgLoaded(el: HTMLImageElement) {
    if (this.getPalette) {
      let image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = async () => {
        this.extractColors(this.getPalette(image));
      };
      image.src = el.src;
    }
  }

  render() {
    if (!this.team) return;

    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={ShieldIcon} title={this.team.name} class="placeholder-icon" />
        ) : (
          <picture>
            {/*<source srcSet={url('min') + ', ' + url('min2x') + ' 2x'} />*/}
            <source srcSet={this.url('min') + ', ' + this.url('middle') + ' 2x'} />
            <img
              src={this.url('min', 'png')}
              alt={this.team.name}
              title={this.team.name}
              onError={e => this.onImgFail(e.target as HTMLImageElement)}
              onLoad={e => this.onMinImgLoaded(e.target as HTMLImageElement)}
            />
          </picture>
        )}
      </Host>
    );
  }
}
