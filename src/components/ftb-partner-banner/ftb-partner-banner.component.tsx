import { Component, Host, h, State, Prop } from '@stencil/core';
import { Banner, BannerSlotCode, HttpClient, envState } from 'ftb-models';

@Component({
  tag: 'ftb-partner-banner',
  styleUrl: 'ftb-partner-banner.component.scss',
  shadow: false,
})
export class FtbPartnerBanner {
  @Prop() slotCode!: BannerSlotCode;
  @Prop() leagueId: number;
  @State() loaded = false;
  private banner: Banner;
  private httpClient: HttpClient;
  private src: string;

  async componentWillLoad() {
    this.banner = await this.loadBanner();
    if (this.banner?._id) {
      this.src = envState.imgHost + '/img/banners/' + this.banner._id + '.gif?version=' + this.banner.photoId;
    }
  }

  private async loadBanner(): Promise<Banner> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Banner(
      await new HttpClient().load({
        host: envState.apiHost,
        url: `/banners/build_banner`,
        method: 'POST',
        headers: headers,
        body: {
          slotCode: this.slotCode,
          appKey: envState.appKey,
          origin: envState.localHost,
          leagueId: this.leagueId,
        },
      }),
    );
  }

  private onBannerClick() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.httpClient.load({
      host: envState.apiHost,
      url: `/banners/${this.banner._id}/register_click`,
      method: 'POST',
      headers: headers,
      body: {
        origin: envState.localHost,
      },
    });
  }

  render() {
    if (!this.banner?._id) return;
    return (
      <Host>
        <div class={{ 'ftb-partner-banner__wrapper': true, 'loaded': this.loaded }}>
          <div class="ftb-partner-banner__background">
            <a target="_blank" href={this.banner.link} onMouseDown={() => this.onBannerClick()}>
              <img src={this.src} onLoad={() => (this.loaded = true)}></img>
            </a>
          </div>
        </div>
      </Host>
    );
  }
}
