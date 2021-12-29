import { Component, h, Host } from '@stencil/core';
import { Stadium } from 'ftb-models';

@Component({
  tag: 'ftb-stadium-photo-stories',
  styleUrl: 'ftb-stadium-photo.stories.scss',
  shadow: false,
})
export class FtbStadiumPhotoStories {
  render() {
    return (
      <Host>
        <h1>Stadium photo</h1>
        <ftb-stadium-photo stadium={new Stadium({ _id: 1108, name: 'Emirates' })} />
        <p>Displays stadium photo image based on player model</p>
        <ftb-code-snippet code="<ftb-stadium-photo stadium={new Stadium({ _id: 1108, name: 'Emirates' })} />" />

        <h2>Placeholder</h2>
        <p>When photo loading fails for some reason, placeholder icon is displayed:</p>
        <ftb-stadium-photo stadium={new Stadium({ _id: -1, name: 'Emirates' })} />
        <ftb-code-snippet code="<ftb-stadium-photo stadium={new Stadium({ _id: -1, name: 'Emirates' })} />" />

        <h2>Lazy loading</h2>
        <p>
          By default image element has attribute <code>loading="lazy"</code> which means it will be loaded only when
          appearing in the viewport. You can override this behaviour by providing param <code>lazy</code> as{' '}
          <code>false</code>
        </p>
        <ftb-code-snippet code='<ftb-stadium-photo lazy="false"  stadium={...} />' />
      </Host>
    );
  }
}
