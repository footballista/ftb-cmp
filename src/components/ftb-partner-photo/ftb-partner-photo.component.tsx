import { Component, Host, h, Prop, State } from '@stencil/core';
import PartnerIcon from '../../assets/icons/partner.svg';
import { envState } from 'ftb-models';
import { Partner } from 'ftb-models/dist/models/partner.model';

@Component({
  tag: 'ftb-partner-photo',
  styleUrl: 'ftb-partner-photo.component.scss',
  shadow: false,
})
export class FtbPartnerPhoto {
  @Prop() partner: Partner; // use Partner model or separate properties below ↙
  @Prop() partnerId: number;
  @Prop() version: number;
  @State() showPlaceholder: boolean = false;
  @State() url: string;

  componentWillLoad() {
    this.url =
      envState.imgHost +
      `/img/partners/${this.partner?._id || this.partnerId}.png?version=${this.partner?.photoId || this.version}`;
  }

  render() {
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={PartnerIcon} />
        ) : (
          <ftb-img src={this.url} onFailed={() => (this.showPlaceholder = true)} />
        )}
      </Host>
    );
  }
}
