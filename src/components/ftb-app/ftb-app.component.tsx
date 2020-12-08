import { Component, h, Host } from '@stencil/core';
import userState from '@src/tools/user-store';
import { Language } from 'ftb-models/dist/models/base/language';
import { getFromStorage } from '@src/tools/storage';

@Component({
  tag: 'ftb-app',
  styleUrl: 'ftb-app.component.scss',
  shadow: true,
})
export class FtbApp {
  async componentWillLoad() {
    const language = (await getFromStorage('language')) || Language.default;
    userState.language = language;
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
