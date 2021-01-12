import { Component, Host, h, Prop, State } from '@stencil/core';
import { User } from 'ftb-models/dist/models/user.model';
import Avatar from '../../assets/icons/avatar.svg';
import { envStore } from '@src/tools/env.store';

@Component({
  tag: 'ftb-user-photo',
  styleUrl: 'ftb-user-photo.component.scss',
  shadow: false,
})
export class FtbUserPhoto {
  @Prop() user: User; // use User model or separate properties below ↙
  @Prop() userId: number;
  @Prop() version: number;
  @State() showPlaceholder: boolean = false;
  @State() url: string;

  componentWillLoad() {
    this.url =
      envStore.imgHost +
      `/img/users/${this.user?._id || this.userId}.jpg?version=${this.user?.photoId || this.version}`;
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
