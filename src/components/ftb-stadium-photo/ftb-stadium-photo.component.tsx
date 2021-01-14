import { Component, Host, h, Prop, State } from '@stencil/core';
import { Stadium, envState } from 'ftb-models';
import Location from '../../assets/icons/location.svg';

@Component({
  tag: 'ftb-stadium-photo',
  styleUrl: 'ftb-stadium-photo.component.scss',
  shadow: false,
})
export class FtbStadiumPhoto {
  @Prop() stadium: Stadium; // use Stadium model or separate properties below ↙
  @Prop() stadiumId: number;
  @Prop() version: number;
  @State() showPlaceholder: boolean = false;
  @State() url: string;

  componentWillLoad() {
    this.url =
      envState.imgHost +
      `/img/stadiums-photos/${this.stadium?._id || this.stadiumId}.png?version=${
        this.stadium?.photoId || this.version
      }`;
  }

  render() {
    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={Location}></ftb-icon>
        ) : (
          <ftb-img src={this.url} onFailed={() => (this.showPlaceholder = true)}></ftb-img>
        )}
      </Host>
    );
  }
}
