import { Component, h, Host } from '@stencil/core';
import { GameVideo, GameVideoType } from 'ftb-models';

@Component({
  tag: 'ftb-video-cover-stories',
  styleUrl: 'ftb-video-cover.stories.scss',
  shadow: false,
})
export class FtbVideoCoverStories {
  render() {
    return (
      <Host>
        <h1>Video-cover</h1>
        <ftb-video-cover
          video={
            new GameVideo({
              _id: 1,
              name: 'Fakel - Krasnodar',
              link: 'https://www.youtube.com/watch?v=PHF_kNFjRlM',
              type: GameVideoType.youtube,
            })
          }
        />
      </Host>
    );
  }
}
