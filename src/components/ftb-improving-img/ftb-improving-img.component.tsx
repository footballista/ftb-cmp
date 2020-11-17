import { Component, Host, h, Prop, State } from '@stencil/core';
@Component({
  tag: 'ftb-improving-img',
  styleUrl: 'ftb-improving-img.component.scss',
  shadow: false,
})
export class FtbImprovingImg {
  @Prop() sources!: string[];
  @State() currentIdx: number = 0;
  @State() firstImgLoaded: boolean = false;
  private images = [];

  onLoad(idx: number) {
    if (idx > this.currentIdx) this.currentIdx = idx;
  }

  /** cancelling img load if component destroyed */
  disconnectedCallback() {
    this.images.forEach(i => (i.src = ''));
  }

  render() {
    return (
      <Host>
        {this.sources.map((s, idx) => (
          <img src={s} class="service-img" onLoad={() => this.onLoad(idx)} ref={e => (this.images[idx] = e)} />
        ))}
        <img
          src={this.sources[this.currentIdx]}
          onLoad={() => (this.firstImgLoaded = true)}
          class={{ visible: this.firstImgLoaded }}
        />
      </Host>
    );
  }
}
