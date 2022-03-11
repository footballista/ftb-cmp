import { Component, h, Host } from '@stencil/core';
import { Country } from 'ftb-models';

@Component({
  tag: 'ftb-country-photo-stories',
  styleUrl: 'ftb-country-photo.stories.scss',
  shadow: false,
})
export class FtbCountryPhotoStories {
  render() {
    return (
      <Host>
        <h1>Country photo</h1>
        <ftb-country-photo country={new Country({ _id: 1372, name: 'Champions League' })} mode="max" />
        <p>Displays photo, set for country. Quality is defined by img size, or can be set manually.</p>
        <ftb-code-snippet code="<ftb-country-photo country={new Country({ _id: 1372, name: 'Champions League' })} />" />

        <h2>Fallback image</h2>
        <p>If no photo is set for the country, league logo will be displayed</p>
        <ftb-country-photo country={new Country({ _id: 1, name: 'Premier league', league: { _id: 394 } })} />
        <ftb-code-snippet code=" <ftb-country-photo country={new Country({ _id: -1, league: { _id: 394 } })} />" />
      </Host>
    );
  }
}
