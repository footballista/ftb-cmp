import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import Avatar from '../../assets/icons/avatar.svg';
import { Player, envState } from 'ftb-models';
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
  @Event() loaded: EventEmitter<boolean>;

  componentWillLoad() {
    this.url =
      envState.imgHost +
      `img/players/${this.player?._id || this.playerId}.jpg?version=${this.player?.photoId || this.version}`;
  }

  onImgLoaded() {
    this.loaded.emit(true);
  }

  onImgFailed() {
    this.showPlaceholder = true;
    this.loaded.emit(true);
  }

  render() {
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={Avatar}></ftb-icon>
        ) : (
          <ftb-img src={this.url} onFailed={() => this.onImgFailed()} onLoaded={() => this.onImgLoaded()}></ftb-img>
        )}
      </Host>
    );
  }
}
