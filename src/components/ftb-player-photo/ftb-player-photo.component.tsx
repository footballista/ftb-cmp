import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import AvatarIcon from '../../assets/icons/avatar.svg';
import { envState, Player } from 'ftb-models';

@Component({
  tag: 'ftb-player-photo',
  styleUrl: 'ftb-player-photo.component.scss',
  shadow: false,
})
export class FtbPlayerPhoto {
  @Prop() player!: Player;
  @Prop() lazy: boolean = true;

  /** Image loading failed (possibly photo does not exist on server), showing default placeholder */
  @State() showPlaceholder: boolean = false;

  @Element() el: HTMLFtbTeamLogoElement;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  render() {
    if (!this.player) return;
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon
            svg={AvatarIcon}
            title={this.player.firstName + ' ' + this.player.lastName}
            class="placeholder-icon"
          />
        ) : (
          <picture>
            <img
              src={envState.imgHost + '/img/players/' + this.player._id + '.jpg?version=' + this.player.photoId}
              title={this.player.firstName + ' ' + this.player.lastName}
              alt={this.player.firstName + ' ' + this.player.lastName}
              onError={e => this.onImgFail(e.target as HTMLImageElement)}
              loading={this.lazy ? 'lazy' : 'eager'}
            />
          </picture>
        )}
      </Host>
    );
  }
}
