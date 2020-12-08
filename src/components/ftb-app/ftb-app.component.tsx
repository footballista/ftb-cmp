import { Component, h, Host } from '@stencil/core';
import userState from '@src/tools/user-store';
import { Language } from 'ftb-models/dist/models/base/language';

@Component({
  tag: 'ftb-app',
  styleUrl: 'ftb-app.component.scss',
  shadow: true,
})
export class FtbApp {
  componentWillRender() {
    userState.user.language = Language.ru;
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
