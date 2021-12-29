import { Component, h, Host } from '@stencil/core';
import { User } from 'ftb-models';

@Component({
  tag: 'ftb-user-photo-stories',
  styleUrl: 'ftb-user-photo.stories.scss',
  shadow: false,
})
export class FtbUserLogoStories {
  render() {
    return (
      <Host>
        <h1>User photo</h1>
        <ftb-user-photo user={new User({ _id: 750, photoId: 1, name: 'Ivan Ivanov' })} />
        <p>Displays player photo image based on player model</p>
        <ftb-code-snippet code="<ftb-user-photo user={new User({ _id: 750, photoId: 1, name: 'Ivan Ivanov' })} />" />
        <h2>Placeholder</h2>
        <p>When photo loading fails for some reason, placeholder icon is displayed:</p>
        <ftb-user-photo user={new User({ _id: -1, photoId: 1, name: 'Ivan Ivanov' })} />
        <ftb-code-snippet code="<ftb-user-photo user={new User({ _id: -1 })} />" />
        <h2>Lazy loading</h2>
        <p>
          By default image element has attribute <code>loading="lazy"</code> which means it will be loaded only when
          appearing in the viewport. You can override this behaviour by providing param <code>lazy</code> as{' '}
          <code>false</code>
        </p>
        <ftb-code-snippet code='<ftb-user-photo lazy="false"  player={...} />' />
      </Host>
    );
  }
}
