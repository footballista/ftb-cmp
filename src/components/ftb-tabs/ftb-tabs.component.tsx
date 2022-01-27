import { Component, Host, h, Prop, writeTask, Element } from '@stencil/core';
@Component({
  tag: 'ftb-tabs',
  styleUrl: 'ftb-tabs.component.scss',
  shadow: false,
})
export class FtbTabs {
  @Prop() tabs!: Array<{ title: () => string; body: () => string }>;
  @Prop({ mutable: true }) selectedTab?: { title: () => string; body: () => string };

  @Element() el: HTMLElement;
  tabsEls: Array<{ headerEl: HTMLElement; bodyEl: HTMLElement }> = [];

  componentDidRender() {
    const tabsEls = [];
    const headerEls: HTMLElement[] = Array.from(this.el.querySelectorAll('.ftb-tabs__header-tab'));
    const bodyEls: HTMLElement[] = Array.from(this.el.querySelectorAll('.ftb-tabs__body-tab'));

    for (let i = 0; i < this.tabs.length; i++) {
      tabsEls.push({ headerEl: headerEls[i], bodyEl: bodyEls[i] });
    }
    this.tabsEls = tabsEls;
    this.onTabClicked(this.selectedTab);
  }

  private onTabClicked(tab: { title: () => string; body: () => string }) {
    this.selectedTab = tab;
    const selectedIdx = this.tabs.findIndex(t => t === this.selectedTab);
    writeTask(() => {
      this.tabsEls.forEach(({ headerEl, bodyEl }, idx) => {
        if (idx == selectedIdx) {
          headerEl.classList.add('selected');
          bodyEl.classList.add('selected');
        } else {
          headerEl.classList.remove('selected');
          bodyEl.classList.remove('selected');
        }
      });
    });
  }

  render() {
    if (!this.tabs) return null;

    if (!this.selectedTab) {
      this.selectedTab = this.tabs[0];
    }

    return (
      <Host class="ftb-tabs">
        <div class="ftb-tabs__header">
          {this.tabs.map(t => (
            <button
              class={'ftb-tabs__header-tab' + (this.selectedTab == t ? ' selected' : '')}
              onClick={() => this.onTabClicked(t)}
            >
              {t.title()}
            </button>
          ))}
        </div>
        <div class="ftb-tabs__body">
          {this.tabs.map(t => (
            <div class={'ftb-tabs__body-tab ' + (this.selectedTab == t ? ' selected' : '')}>{t.body()}</div>
          ))}
        </div>
      </Host>
    );
  }
}
