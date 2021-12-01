import { Component, Host, h, Prop, State } from '@stencil/core';
import { Post, envState } from 'ftb-models';

@Component({
  tag: 'ftb-post-photo',
  styleUrl: 'ftb-post-photo.component.scss',
  shadow: false,
})
export class FtbPostCover {
  @Prop() post!: Post;
  @Prop() mode: 'max' | 'middle' | 'min' = 'min';
  @State() loaded: boolean;
  @State() error: boolean;
  private coverUrl: string;

  componentWillLoad() {
    this.coverUrl = envState.imgHost + `/img/news/${this.post._id}-${this.mode}.jpg?version=${this.post.photoId}`;
  }

  render() {
    return (
      <Host>
        <img
          src={this.coverUrl}
          onLoad={() => (this.loaded = true)}
          onError={() => (this.error = true)}
          class={{ loaded: this.loaded, error: this.error }}
        />
      </Host>
    );
  }
}
