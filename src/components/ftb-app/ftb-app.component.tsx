import { Component, h, Host, Prop } from '@stencil/core';
import { getFromStorage, userState, Language } from 'ftb-models';

@Component({
  tag: 'ftb-app',
  styleUrl: 'ftb-app.component.scss',
  shadow: true,
})
export class FtbApp {
  @Prop() firebaseConfig: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    vapidKey: string;
  };

  async componentWillLoad() {
    const language = (await getFromStorage('language')) || Language.default;
    // if (this.firebaseConfig) {
    //   const firebase = (await import('firebase/app')).default;
    // await import('firebase/messaging');
    // const fireApp = await firebase.initializeApp(this.firebaseConfig);
    // firebaseState.messaging = fireApp.messaging();
    // userState.token = await firebaseState.messaging.getToken({
    //   vapidKey: this.firebaseConfig.vapidKey,
    // });
    // }

    userState.language = language;
    // userState.token = '';
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
