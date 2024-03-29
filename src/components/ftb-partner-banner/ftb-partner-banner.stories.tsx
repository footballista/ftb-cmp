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
        <ftb-partner-banner slotCode={BannerSlotCode.mobile_game} leagueId={394} />
        <p>
          Gets image from partner API, that suits provided <code>Slot Code</code>
        </p>
        <ftb-code-snippet code="<ftb-partner-banner slotCode={BannerSlotCode.site_footer} />" />
        <p>
          Banner generation also depends on <code>App Key</code> that is defined at application root level
        </p>
      </Host>
    );
  }
}
