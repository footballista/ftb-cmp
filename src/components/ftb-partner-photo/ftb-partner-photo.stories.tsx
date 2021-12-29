import { Component, h, Host } from '@stencil/core';
import { Partner } from 'ftb-models/dist/models/partner.model';

@Component({
  tag: 'ftb-partner-photo-stories',
  styleUrl: 'ftb-partner-photo.stories.scss',
  shadow: false,
})
export class FtbPartnerPhotoStories {
  render() {
    return (
      <Host>
        <h1>Partner photo</h1>
        <ftb-partner-photo partner={new Partner({ _id: 3, photoId: 1, name: 'Матч! Премьер' })} />
        <p>Displays partner photo image based on partner model</p>
        <ftb-code-snippet code="<ftb-partner-photo partner={new Partner({ _id: 3, photoId: 1, name: 'Матч! Премьер' })} />" />
        <h2>Placeholder</h2>
        <p>When photo loading fails for some reason, placeholder icon is displayed:</p>
        <ftb-partner-photo partner={new Partner({ _id: -1 })} />
        <ftb-code-snippet code="<ftb-partner-photo partner={new Partner({ _id: -1 })} />" />
      </Host>
    );
  }
}
