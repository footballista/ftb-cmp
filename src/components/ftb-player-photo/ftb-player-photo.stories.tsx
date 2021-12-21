import { Component, h, Host } from '@stencil/core';
import { Player } from 'ftb-models';

@Component({
  tag: 'ftb-player-photo-stories',
  styleUrl: 'ftb-player-photo.stories.scss',
  shadow: false,
})
export class FtbPlayerPhotoStories {
  render() {
    return (
      <Host>
        <h1>Player photo</h1>
        <ftb-player-photo player={new Player({ _id: 1, photoId: 1, firstName: 'Ivan', lastName: 'Ivanov' })} />
        <p>Displays player photo image based on player model</p>
        <ftb-code-snippet code="<ftb-player-photo player={new Player({ _id: 1, photoId: 1, firstName: 'Ivan', lastName: 'Ivanov' })} />" />
        <h2>Placeholder</h2>
        <p>When photo loading fails for some reason, placeholder icon is displayed:</p>
        <ftb-player-photo player={new Player({ _id: -1, photoId: 1, firstName: 'Ivan', lastName: 'Ivanov' })} />
        <ftb-code-snippet code="<ftb-player-photo player={new Player({ _id: -1 })} />" />
        <h2>Lazy loading</h2>
        <p>
          By default image element has attribute <code>loading="lazy"</code> which means it will be loaded only when
          appearing in the viewport. You can override this behaviour by providing param <code>lazy</code> as{' '}
          <code>false</code>
        </p>
        <ftb-code-snippet code='<ftb-player-photo lazy="false"  player={...} />' />
      </Host>
    );
  }
}
