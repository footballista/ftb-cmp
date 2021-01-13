import { Component, Host, h, Prop } from '@stencil/core';
import { Stadium } from 'ftb-models';
@Component({
  tag: 'ftb-stadium-card',
  styleUrl: 'ftb-stadium-card.component.scss',
  shadow: false,
})
export class FtbStadiumCard {
  @Prop() stadium!: Stadium;

  render() {
    return (
      <Host>
        <ftb-link route="stadium" params={{ stadiumId: this.stadium._id, stadiumName: this.stadium.name }}>
          <div class="ftb-stadium-card__wrapper">
            <div class="ftb-stadium-card__background">
              <div class="ftb-stadium-card__image">
                <ftb-stadium-photo stadium={this.stadium}></ftb-stadium-photo>
              </div>
              <div class="ftb-stadium-card__title">{this.stadium.name}</div>
            </div>
          </div>
        </ftb-link>
      </Host>
    );
  }
}
