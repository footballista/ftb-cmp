import { Component, h, Host, State } from '@stencil/core';

@Component({
  tag: 'ftb-infinite-scroll-stories',
  styleUrl: 'ftb-infinite-scroll.stories.scss',
  shadow: false,
})
export class FtbInfiniteScrollStories {
  @State() firstCase = [];
  @State() secondCase = [];
  gotSecondCaseError = false;
  @State() thirdCase = [];

  render() {
    return (
      <Host>
        <h1>Infinite scroll</h1>
        <p>
          Place this element at the end of list of items. It will run passed <code>loadData</code> function when user
          scrolls to the end of the list
        </p>
        <div class="scrolled-content">
          {this.firstCase.map(i => (
            <div class="row">random number #{i}</div>
          ))}
          <ftb-infinite-scroll loadData={() => this.loadFirstCaseData()} />
        </div>
        <ftb-code-snippet code="<ftb-infinite-scroll loadData={() => loadRandomDataIntoArray()} />" />

        <h2>Error handling</h2>

        <p>In case of error component will render error message with "try again"</p>

        <div class="scrolled-content">
          {this.secondCase.map(i => (
            <div class="row">random number #{i}</div>
          ))}
          <ftb-infinite-scroll loadData={() => this.loadSecondCaseData()} />
        </div>
      </Host>
    );
  }

  loadFirstCaseData() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.firstCase = [
          ...this.firstCase,
          ...Array(6)
            .fill(0)
            .map(() => Math.round(Math.random() * 100)),
        ];
        return resolve(true);
      }, 1000);
    });
  }

  /** crashes every 2nd attempt */
  loadSecondCaseData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.secondCase.length || this.gotSecondCaseError) {
          this.secondCase = [
            ...this.secondCase,
            ...Array(6)
              .fill(0)
              .map(() => Math.round(Math.random() * 100)),
          ];
          this.gotSecondCaseError = false;
        } else {
          this.gotSecondCaseError = true;
          reject('failed to load data');
        }
        return resolve(true);
      }, 1000);
    });
  }

  generateData() {
    return Array(10)
      .fill(0)
      .map(() => Math.round(Math.random() * 100));
  }
}
