import { Component, h, Host } from '@stencil/core';
import { Country } from 'ftb-models';

@Component({
  tag: 'ftb-flag-stories',
  styleUrl: 'ftb-flag.stories.scss',
  shadow: false,
})
export class FtbFlagStories {
  paletteEl: HTMLDivElement;

  render() {
    return (
      <Host>
        <h1>Flag</h1>
        <ftb-flag flag={new Country({ name: 'USA', flag: 'usa' }).flag} />
        <p>Displays national flag icon</p>
        <ftb-code-snippet code="<ftb-flag flag={new Country({ name: 'USA', flag: 'usa' }).flag} />" />

        <h2>Color palette</h2>
        <p>
          You can pass <code>extractColors</code> handler to component. In this case it will analyze flag image and pass
          color palette to this callback
        </p>
        <ftb-flag extractColors={e => this.setPalette(e)} flag={new Country({ name: 'Russia', flag: 'ru' }).flag} />
        <div class="palette" ref={el => (this.paletteEl = el)}>
          <div class="color" />
          <div class="color" />
          <div class="color" />
        </div>
      </Host>
    );
  }

  setPalette(colors) {
    const slots = Array.from(this.paletteEl.children) as HTMLDivElement[];
    slots.forEach((slot, idx) => {
      const [r, g, b] = colors[idx];
      slot.style['background-color'] = `rgb(${r}, ${g}, ${b})`;
    });
  }
}
