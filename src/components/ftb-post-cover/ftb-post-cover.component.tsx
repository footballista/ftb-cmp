import { Component, Host, h, Prop } from '@stencil/core';
import { Post } from 'ftb-models';
@Component({
  tag: 'ftb-post-cover',
  styleUrl: 'ftb-post-cover.component.scss',
  shadow: true,
})
export class FtbPostCover {
  @Prop() post!: Post;

  render() {
    return <Host>{this.post.title}</Host>;
  }
}
