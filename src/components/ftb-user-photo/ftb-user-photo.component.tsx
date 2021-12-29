import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import AvatarIcon from '../../assets/icons/avatar.svg';
import { User, envState } from 'ftb-models';

@Component({
  tag: 'ftb-user-photo',
  styleUrl: 'ftb-user-photo.component.scss',
  shadow: false,
})
export class FtbUserPhoto {
  @Prop() user!: User;
  @Prop() lazy: boolean = true;

  /** Image loading failed (possibly photo does not exist on server), showing default placeholder */
  @State() showPlaceholder: boolean = false;

  @Element() el: HTMLFtbTeamLogoElement;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  render() {
    if (!this.user) return;
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={AvatarIcon} title={this.user.name} class="placeholder-icon" />
        ) : (
          <picture>
            <img
              src={envState.imgHost + '/img/users/' + this.user._id + '.jpg?version=' + this.user.photoId}
              title={this.user.name}
              alt={this.user.name}
              onError={e => this.onImgFail(e.target as HTMLImageElement)}
              loading={this.lazy ? 'lazy' : 'eager'}
            />
          </picture>
        )}
      </Host>
    );
  }
}
