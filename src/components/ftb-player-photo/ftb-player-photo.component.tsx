import { Component, Host, h, Prop, State } from '@stencil/core';
import Avatar from '../../assets/icons/avatar.svg';
import { Player } from 'ftb-models/dist/models/player.model';
import { envStore } from '@src/tools/env.store';
@Component({
  tag: 'ftb-player-photo',
  styleUrl: 'ftb-player-photo.component.scss',
  shadow: false,
})
export class FtbPlayerPhoto {
  @Prop() player: Player; // use Player model or separate properties below ↙
  @Prop() playerId: number;
  @Prop() version: number;
  @State() showPlaceholder: boolean = false;
  @State() url: string;

  componentWillLoad() {
    this.url =
      envStore.imgHost +
      `img/players/${this.player?._id || this.playerId}.jpg?version=${this.player?.photoId || this.version}`;
  }

  render() {
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={Avatar}></ftb-icon>
        ) : (
          <ftb-img src={this.url} onFailed={() => (this.showPlaceholder = true)}></ftb-img>
        )}
      </Host>
    );
  }
}
