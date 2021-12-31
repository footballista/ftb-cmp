import { Component, Host, h, Prop, State } from '@stencil/core';
import { Post, envState } from 'ftb-models';

@Component({
  tag: 'ftb-post-cover',
  styleUrl: 'ftb-post-cover.component.scss',
  shadow: false,
})
export class FtbPostCover {
  @Prop() post!: Post;
  @State() loaded: boolean;
  private coverUrl: string;

  componentWillLoad() {
    this.coverUrl = envState.imgHost + `/img/news/${this.post._id}.jpg?version=${this.post.photoId}`;
  }

  render() {
    if (!this.post) return null;

    return (
      <Host>
        <ftb-link route="post" params={{ postId: this.post._id, postTitle: this.post.title }}>
          <div class="ftb-post-cover__wrapper">
            <div class={{ 'ftb-post-cover__background': true, 'loaded': this.loaded }}>
              <div
                class="ftb-post-cover__image"
                style={{ 'background-image': this.loaded ? `url('${this.coverUrl}')` : 'unset' }}
              ></div>
              <div class="ftb-post-cover__title">{this.post.title}</div>
            </div>
          </div>
          <img src={this.coverUrl} onLoad={() => (this.loaded = true)} class="ftb-post-cover__helper-img" />
        </ftb-link>
      </Host>
    );
  }
}
