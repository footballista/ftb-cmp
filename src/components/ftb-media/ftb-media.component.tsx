import { Component, Host, h, Prop } from '@stencil/core';
import { Game, GameVideo, Post } from 'ftb-models';
@Component({
  tag: 'ftb-media',
  styleUrl: 'ftb-media.component.scss',
  shadow: true,
})
export class FtbMedia {
  @Prop() news: Post[];
  @Prop() photoGames: Game[];
  @Prop() videos: GameVideo[];

  render() {
    return <Host>MEDIA</Host>;
  }
}
