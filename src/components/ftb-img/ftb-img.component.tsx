import { Component, Host, EventEmitter, Event, h, Prop, State } from '@stencil/core';
import ColorThief from 'colorthief';

@Component({
  tag: 'ftb-img',
  styleUrl: 'ftb-img.component.scss',
  shadow: false,
})
export class FtbImg {
  @Prop() src!: string;
  @Prop() name: string;
  @Event() loaded: EventEmitter<boolean>;
  @Event() failed: EventEmitter<boolean>;
  @Event() color: EventEmitter<[number, number, number][]>;
  @State() isLoaded: boolean = false;
  private image: HTMLImageElement;
  private isDestroyed: boolean;

  private onLoad() {
    if (this.isDestroyed) return;
    this.isLoaded = true;
    this.loaded.emit(true);
    const colorThief = new ColorThief();
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = async () => {
      this.color.emit(colorThief.getPalette(image));
    };
    image.src = this.image.src;
  }

  disconnectedCallback() {
    this.isDestroyed = true;
  }

  render() {
    return (
      <Host>
        <div class="wrapper">
          <img
            src={this.src}
            onError={() => this.failed.emit(true)}
            title={this.name}
            onLoad={() => this.onLoad()}
            ref={el => (this.image = el)}
            class={{ loaded: this.isLoaded }}
          />
        </div>
      </Host>
    );
  }
}
