import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'ftb-icon',
  styleUrl: 'ftb-icon.component.scss',
  shadow: false,
})
export class FtbIcon {
  @Prop() svg!: string;

  render() {
    if (!this.svg) return null;

    return <Host innerHTML={this.svg} />;
  }
}
