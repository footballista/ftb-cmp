import { Component, Host, h, Prop } from '@stencil/core';
import { GameStaff, translations, userState } from 'ftb-models';

@Component({
  tag: 'ftb-game-person',
  styleUrl: 'ftb-game-person.component.scss',
  shadow: false,
})
export class FtbGamePerson {
  @Prop() person!: GameStaff;

  render() {
    return (
      <Host>
        <div class="role">{translations.role[this.person.role][userState.language]}</div>
        <div class="delimiter">:</div>
        <div class="name">{this.person.user.name}</div>
      </Host>
    );
  }
}
