import { Component, Element, h, Host, Prop } from '@stencil/core';
import { Game, StageFormat } from 'ftb-models';
import { Language } from 'ftb-models/dist/models/base/language';
import { getComponentLanguage } from '@src/tools/component-language';

type TourLangBlock = {
  [Language.default]: string | string[];
} & {
  [L in Language]?: string | string[];
};

@Component({
  tag: 'ftb-game-tour',
  styleUrl: 'ftb-game-tour.component.scss',
  shadow: true,
})
export class FtbGameTour {
  @Prop() game: Game;
  @Element() element: HTMLElement;
  private i18n: Record<string, TourLangBlock> = {
    round: {
      en: 'round',
      ru: 'тур',
    },
    cup: {
      en: [
        'final',
        'semifinal',
        'quarterfinal',
        '1/8 final',
        '1/16 final',
        '1/32 final',
        '1/64 final',
        '1/128 final',
        '1/3 final',
        '1/6 final',
        '1/12 final',
        'for 3rd place',
      ],
      ru: [
        'финал',
        'полуфинал',
        'четвертьфинал',
        '1/8 финала',
        '1/16 финала',
        '1/32 финала',
        '1/64 финала',
        '1/128 финала',
        '1/3 финала',
        '1/6 финала',
        '1/12 финала',
        'за 3 место',
      ],
    },
  };

  translate(key: string) {
    return this.i18n[key][getComponentLanguage(this.element)];
  }

  render() {
    const lang = getComponentLanguage(this.element);
    return (
      <Host>
        {this.game.stage.format === StageFormat.cup
          ? this.i18n.cup[lang][this.game.tourNumber]
          : this.game.tourNumber + ' ' + this.i18n.round[lang]}
      </Host>
    );
  }
}
