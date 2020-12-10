import { Component, h, Host, Prop } from '@stencil/core';
import userState from '@src/tools/user.store';
import fireServicesState from '@src/tools/firebase-services.store';
import { Language } from 'ftb-models/dist/models/base/language';
import { getFromStorage } from '@src/tools/storage';

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
    if (this.firebaseConfig) {
      const firebase = (await import('firebase/app')).default;
      await import('firebase/messaging');
      const fireApp = await firebase.initializeApp(this.firebaseConfig);
      fireServicesState.messaging = fireApp.messaging();
      userState.token = await fireServicesState.messaging.getToken({
        vapidKey: this.firebaseConfig.vapidKey,
      });
    }

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
