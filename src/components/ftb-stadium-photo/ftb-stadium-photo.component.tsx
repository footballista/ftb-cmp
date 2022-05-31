import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import { Stadium, envState } from 'ftb-models';
// import LocationIcon from '../../assets/icons/location.svg';
import StadiumIcon from '../../assets/icons/stadium.svg';

@Component({
  tag: 'ftb-stadium-photo',
  styleUrl: 'ftb-stadium-photo.component.scss',
  shadow: false,
})
export class FtbStadiumPhoto {
  @Prop() stadium!: Stadium;
  @Prop() lazy: boolean = true;

  /** Image loading failed (possibly photo does not exist on server), showing default placeholder */
  @State() showPlaceholder: boolean = false;
  @State() loading: boolean = true;

  @Element() el: HTMLFtbTeamLogoElement;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  render() {
    if (!this.stadium) return;
    return (
      <Host class={{ loading: this.loading }}>
        {this.showPlaceholder ? (
          <ftb-icon svg={StadiumIcon} title={this.stadium.name} class="placeholder-icon" />
        ) : (
          <picture>
            <img
              src={
                envState.imgHost + '/img/stadiums-photos/' + this.stadium._id + '.png?version=' + this.stadium.photoId
              }
              title={this.stadium.name}
              alt={this.stadium.name}
              onError={e => {
                this.onImgFail(e.target as HTMLImageElement);
                this.loading = false;
              }}
              onLoad={() => {
                this.loading = false;
              }}
              loading={this.lazy ? 'lazy' : 'eager'}
            />
          </picture>
        )}
      </Host>
    );
  }
}
