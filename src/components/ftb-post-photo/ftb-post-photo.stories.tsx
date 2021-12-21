import { Component, h, Host } from '@stencil/core';
import { Post } from 'ftb-models';

@Component({
  tag: 'ftb-post-photo-stories',
  styleUrl: 'ftb-post-photo.stories.scss',
  shadow: false,
})
export class FtbTeamLogoStories {
  render() {
    return (
      <Host>
        <h1>Post photo</h1>
        <ftb-post-photo post={new Post({ _id: 183270, title: 'First Post' })} />
        <p>Displays post photo image based on post model</p>
        <ftb-code-snippet code="  <ftb-post-photo post={new Post({ _id: 183270, title: 'First Post' })} />" />
        <h2>Placeholder</h2>
        <p>When photo loading fails for some reason, placeholder icon is displayed:</p>
        <ftb-post-photo post={new Post({ _id: -1, title: 'Incorrect Post' })} />
        <ftb-code-snippet code="  <ftb-post-photo post={new Post({ _id: -, title: 'Incorrect Post' })} />" />
      </Host>
    );
  }
}
