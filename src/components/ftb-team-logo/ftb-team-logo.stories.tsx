import { Component, h, Host } from '@stencil/core';
import { Team } from 'ftb-models';

@Component({
  tag: 'ftb-team-logo-stories',
  styleUrl: 'ftb-team-logo.stories.scss',
  shadow: false,
})
export class FtbTeamLogoStories {
  paletteEl: HTMLDivElement;

  render() {
    return (
      <Host>
        <h1>Team logo</h1>
        <ftb-team-logo team={new Team({ logo: 'Arsenal', logoId: 1 })} />
        <p>Displays team logo image based on team model</p>
        <ftb-code-snippet code="<ftb-team-logo team={new Team({ logo: 'Arsenal', logoId: 1} )}/>" />
        <h2>Image quality</h2>
        <p>
          Image quality is defined automatically based on element size, but you can set it manually by passing "mode"
          parameter <ftb-code-snippet code='mode="(min | middle | max)"' />
        </p>
        <h2>Placeholder</h2>
        <p>When logo loading fails for some reason, placeholder icon is displayed:</p>
        <ftb-team-logo team={new Team({ logo: 'IncorrectLogo', logoId: 1 })} />

        <h2>Color palette</h2>
        <p>
          You can pass <code>extractColors</code> handler to component. In this case it will analyze logo image and pass
          color palette to this callback
        </p>
        <ftb-team-logo extractColors={e => this.setPalette(e)} team={new Team({ logo: 'Arsenal', logoId: 1 })} />
        <div class="palette" ref={el => (this.paletteEl = el)}>
          <div class="color" />
          <div class="color" />
          <div class="color" />
        </div>

        <ftb-code-snippet code=" <ftb-team-logo extractColors={e => console.log(e)} team={new Team({ logo: 'Arsenal', logoId: 1 })} />" />
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
