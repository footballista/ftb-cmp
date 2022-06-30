import { Component, h, Host } from '@stencil/core';
import { Player } from 'ftb-models';

@Component({
  tag: 'ftb-photo-loader-stories',
  styleUrl: 'ftb-photo-loader.stories.scss',
  shadow: false,
})
export class FtbPhotoLoaderStories {
  render() {
    return (
      <Host>
        <h1>Photo loader</h1>
        <ftb-photo-loader>
          <ftb-player-photo player={new Player({ _id: 1 })} />
        </ftb-photo-loader>
        <p>Uploads player/user photo via Capacitor camera plugin, then provides crop and scale functionality</p>
        <ftb-code-snippet code="<ftb-code-snippet onNewImg={(base64) => ... } />" />
      </Host>
    );
  }
}
