import { Component, h, Host } from '@stencil/core';
import { BannerSlotCode } from 'ftb-models';

@Component({
  tag: 'ftb-partner-banner-stories',
  styleUrl: 'ftb-partner-banner.stories.scss',
  shadow: false,
})
export class FtbPartnerBannerStories {
  render() {
    return (
      <Host>
        <h1>Partner Banner</h1>
        <p>Gets image from partner API, that suits provided App Code and Slot Code</p>
        <ftb-partner-banner slotCode={BannerSlotCode.site_footer} leagueId={394} />
      </Host>
    );
  }
}
