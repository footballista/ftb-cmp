import { Component, h, Host } from '@stencil/core';
import userState from '@src/tools/user-store';
import Uk from '../../assets/flags/united kingdom.svg';
import Ru from '../../assets/flags/russia.svg';
import { Language } from 'ftb-models/dist/models/base/language';

@Component({
  tag: 'ftb-language-select',
  styleUrl: 'ftb-language-select.component.scss',
  shadow: false,
})
export class FtbLanguageSelect {
  render() {
    return (
      <Host>
        <ftb-icon
          svg={Uk}
          title="English"
          class={{ selected: userState.language === Language.en }}
          onClick={() => (userState.language = Language.en)}
        ></ftb-icon>
        <ftb-icon
          svg={Ru}
          title="Русский"
          class={{ selected: userState.language === Language.ru }}
          onClick={() => (userState.language = Language.ru)}
        ></ftb-icon>
      </Host>
    );
  }
}
