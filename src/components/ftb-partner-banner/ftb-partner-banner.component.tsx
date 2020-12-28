import { Component, Host, h, State, Prop } from '@stencil/core';
import { Banner, BannerSlotCode, User } from 'ftb-models';
import { HttpClient } from 'ftb-models/dist/tools/clients/http.client';
import { environmentStore } from '@src/tools/environment.store';

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
    this.httpClient = new HttpClient(environmentStore.appKey, new User());
    this.banner = await this.loadBanner();
    if (this.banner?._id) {
      this.src = environmentStore.photoHost + '/img/banners/' + this.banner._id + '.gif?version=' + this.banner.photoId;
    }
  }

  private async loadBanner(): Promise<Banner> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Banner(
      await this.httpClient.load({
        host: environmentStore.apiHost,
        url: `/banners/build_banner`,
        method: 'POST',
        headers: headers,
        body: {
          slotCode: this.slotCode,
          appKey: environmentStore.appKey,
          origin: environmentStore.localHost,
          leagueId: this.leagueId,
        },
      }),
    );
  }

  private onBannerClick() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.httpClient.load({
      host: environmentStore.apiHost,
      url: `/banners/${this.banner._id}/register_click`,
      method: 'POST',
      headers: headers,
      body: {
        origin: environmentStore.localHost,
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
