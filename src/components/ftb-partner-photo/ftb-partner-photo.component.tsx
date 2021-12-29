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
  @Prop() partner!: Partner;

  /** Image loading failed (possibly photo does not exist on server), showing default placeholder */
  @State() showPlaceholder: boolean = false;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  render() {
    if (!this.partner) return null;

    const url = envState.imgHost + `/img/partners/${this.partner?._id}.png?version=${this.partner?.photoId}`;
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={PartnerIcon} />
        ) : (
          <img
            src={url}
            title={this.partner.name}
            alt={this.partner.name}
            loading="lazy"
            onError={e => this.onImgFail(e.target as HTMLImageElement)}
          />
        )}
      </Host>
    );
  }
}
