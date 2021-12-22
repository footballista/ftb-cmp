import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import { checkElementSize, envState, Team } from 'ftb-models';
import ShieldIcon from '../../assets/icons/shield.svg';

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
  @Prop({ mutable: true }) mode?: 'min' | 'middle' | 'max';

  /** Image loading failed (possibly logo does not exist on server), showing default placeholder */
  @State() showPlaceholder: boolean = false;

  @Element() el: HTMLFtbTeamLogoElement;

  getPalette: (el: HTMLImageElement) => Array<[number, number, number]>;

  async componentDidLoad() {
    if (!this.mode) {
      const { width } = checkElementSize(this.el);
      if (width > 200) {
        this.mode = 'max';
      } else if (width > 50) {
        this.mode = 'middle';
      }
    }

    if (this.el['extractColors']) {
      this.getPalette = (await import('colorthief')).default.prototype.getPalette;
    }
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

    const url = (size, _ = 'webp') =>
      // envState.imgHost + `img/logos/${this.team.logo}-` + size + '.' + format + `?logoId=${this.team.logoId}`;
      envState.imgHost + `img/logos/${this.team.logo}-` + size + '.png' + `?logoId=${this.team.logoId}`;

    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={ShieldIcon} title={this.team.name} class="placeholder-icon" />
        ) : (
          [
            <picture>
              <source srcSet={url('min') + ', ' + url('min2x') + ' 2x'} />
              <img
                src={url('min', 'png')}
                alt={this.team.name}
                title={this.team.name}
                onError={e => this.onImgFail(e.target as HTMLImageElement)}
                onLoad={e => this.onMinImgLoaded(e.target as HTMLImageElement)}
              />
            </picture>,
            this.mode == 'middle' ? (
              <picture>
                <source srcSet={url('middle') + ', ' + url('max') + ' 2x'} />
                <img
                  src={url('middle', 'png')}
                  alt={this.team.name}
                  title={this.team.name}
                  onError={e => this.onImgFail(e.target as HTMLImageElement)}
                  loading="lazy"
                />
              </picture>
            ) : null,
            this.mode == 'max' ? (
              <picture>
                <source srcSet={url('max')} />
                <img
                  src={url('max', 'png')}
                  alt={this.team.name}
                  title={this.team.name}
                  onError={e => this.onImgFail(e.target as HTMLImageElement)}
                  loading="lazy"
                />
              </picture>
            ) : null,
          ]
        )}
      </Host>
    );
  }
}
