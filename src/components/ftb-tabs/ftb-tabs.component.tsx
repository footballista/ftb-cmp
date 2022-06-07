import { Component, Host, h, Prop, writeTask, Element, Watch } from '@stencil/core';
import fromPairs from 'lodash-es/fromPairs';
import smoothscroll from 'smoothscroll-polyfill';

@Component({
  tag: 'ftb-tabs',
  styleUrl: 'ftb-tabs.component.scss',
  shadow: false,
})
export class FtbTabs {
  @Prop() tabs!: Array<{ title: () => string; body: () => string; key: string }>;
  /** unique key for using in hash navigation */
  @Prop({ mutable: true }) navKey?: string = 'tabs';
  selectedTab?: { title: () => string; body: () => string; key: string };
  @Element() el: HTMLElement;
  tabsEls: Array<{ headerEl: HTMLElement; bodyEl: HTMLElement }> = [];

  constructor() {
    this.onHashChange = this.onHashChange.bind(this);
  }

  @Watch('tabs') onTabsChange() {
    this.onHashChange();
  }

  connectedCallback() {
    smoothscroll.polyfill();
    window.addEventListener('hashchange', this.onHashChange);
    this.onHashChange();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.onHashChange);
  }

  onHashChange() {
    const keys = this.readHash();
    if (keys[this.navKey]) {
      const tab = this.tabs.find(t => t.key == keys[this.navKey]);
      if (tab) {
        this.onTabSelected(tab);
      }
    }
  }

  readHash() {
    const hash = location.hash?.slice(1);
    if (hash) {
      return fromPairs(hash.split(';').map(s => s.split(':')));
    } else {
      return {};
    }
  }

  componentDidRender() {
    const tabsEls = [];
    const headerEls: HTMLElement[] = Array.from(
      this.el.parentElement.querySelectorAll(`#${this.navKey} > .ftb-tabs__header > .ftb-tabs__header-tab`),
    );
    const bodyEls: HTMLElement[] = Array.from(
      this.el.parentElement.querySelectorAll(`#${this.navKey} > .ftb-tabs__body > .ftb-tabs__body-tab`),
    );

    for (let i = 0; i < this.tabs.length; i++) {
      tabsEls.push({ headerEl: headerEls[i], bodyEl: bodyEls[i] });
    }
    this.tabsEls = tabsEls;
    this.onTabSelected(this.selectedTab);
  }

  private onTabSelected(tab: { title: () => string; body: () => string; key: string }) {
    if (this.selectedTab == tab) {
      const activeTabIdx = this.tabs.findIndex(t => t.key == tab.key);
      this.tabsEls[activeTabIdx].bodyEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
    } else {
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

      const hash = this.readHash();
      hash[this.navKey] = tab.key;
      const hashKeys = Object.keys(hash)
        .map(key => key + ':' + hash[key])
        .join(';');

      const newLocation = location.pathname + '#' + hashKeys;
      if (location.href != location.origin + newLocation) {
        history.replaceState(null, '', newLocation);
      }
    }
  }

  render() {
    if (!this.tabs) return null;

    if (!this.selectedTab) {
      this.selectedTab = this.tabs[0];
    }

    return (
      <Host class="ftb-tabs" id={this.navKey}>
        <div class="ftb-tabs__header">
          {this.tabs.map(t => (
            <button
              class={'ftb-tabs__header-tab' + (this.selectedTab == t ? ' selected' : '')}
              onClick={() => this.onTabSelected(t)}
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
