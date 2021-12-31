import { Component, Host, h, Prop } from '@stencil/core';
import { LicenseAgreement } from 'ftb-models';
@Component({
  tag: 'ftb-license-agreement',
  styleUrl: 'ftb-license-agreement.component.scss',
  shadow: false,
})
export class FtbLicenseAgreement {
  @Prop() license!: LicenseAgreement;

  render() {
    if (!this.license) return null;

    return (
      <Host>
        <div class="ftb-license-agreement__wrapper">
          <div class="ftb-license-agreement__background">
            {this.license.tokens.map(token => this.renderToken(token))}
          </div>
        </div>
      </Host>
    );
  }

  private renderToken(token: LicenseAgreement['tokens'][0]) {
    const Tag = token.type.startsWith('h') ? 'h' + parseInt(token.type.slice(1)) : 'p';
    return <Tag>{token.text}</Tag>;
  }
}
