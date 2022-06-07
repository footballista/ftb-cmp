import { Component, Host, h, Prop, writeTask, Watch, Method } from '@stencil/core';
import fromPairs from 'lodash-es/fromPairs';
import Swiper from 'swiper';
import smoothscroll from 'smoothscroll-polyfill';

interface TabInterface {
  title: () => string;
  body: () => string;
  key: string;
}

@Component({
  tag: 'ftb-collapsible-tabs',
  styleUrl: 'ftb-collapsible-tabs.component.scss',
  shadow: false,
})
export class FtbCollapsibleTabsComponent {
  @Prop() renderHeader: () => string;
  @Prop() tabs!: Array<{ title: () => string; body: () => string; key: string }>;
  /** unique key for using in hash navigation */
  @Prop({ mutable: true }) navKey?: string = 'tabs';
  @Prop() collapsedPadding = 50;
  isCollapsed: boolean;
  tabsEls: Array<{ headerEl: HTMLElement; bodyEl: HTMLElement }> = [];
  selectedTab?: { title: () => string; body: () => string; key: string };
  headerEl;
  bodyEl;
  swiperEl;
  swiper;

  constructor() {
    this.onHashChange = this.onHashChange.bind(this);
    this.onTabScroll = this.onTabScroll.bind(this);
  }

  @Watch('tabs') onTabsChange() {
    this.onHashChange();
  }

  @Method() update() {
    this.swiper.update();
  }

  connectedCallback() {
    smoothscroll.polyfill();
    window.addEventListener('hashchange', this.onHashChange);
    this.onHashChange();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.onHashChange);
  }

  componentDidLoad() {
    this.swiper = new Swiper(this.swiperEl, {
      threshold: 20,
      resistance: false,
    });

    this.swiper.on('activeIndexChange', e => {
      this.onTabSelected(this.tabs[e.activeIndex]);
      if (!this.isCollapsed) {
        this.collapse();
      }
    });

    const tabsEls = [];
    const headerEls: HTMLElement[] = Array.from(
      this.bodyEl.querySelectorAll(`.ftb-c-tabs__header > .ftb-c-tabs__header-tab`),
    );
    const bodyEls: HTMLElement[] = Array.from(
      this.bodyEl.querySelectorAll(`.ftb-c-tabs__body > .swiper-wrapper > .ftb-c-tabs__body-tab`),
    );

    for (let i = 0; i < this.tabs.length; i++) {
      tabsEls.push({ headerEl: headerEls[i], bodyEl: bodyEls[i] });
    }

    bodyEls.forEach(el => {
      const vsEl = el.querySelector('ftb-virtual-scroll');
      if (vsEl) {
        vsEl.removeEventListener('scroll', this.onTabScroll);
        vsEl.addEventListener('scroll', this.onTabScroll);
      } else {
        el.removeEventListener('scroll', this.onTabScroll);
        el.addEventListener('scroll', this.onTabScroll);
      }
    });

    this.tabsEls = tabsEls;
    if (!this.selectedTab) {
      this.selectedTab = this.tabs[0];
    }
    this.onTabSelected(this.selectedTab);
  }

  onTabScroll() {
    const { target } = arguments[0];
    if (!this.isCollapsed) {
      if (target.scrollTop >= this.collapsedPadding) {
        this.collapse();
      }
    }
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

  collapse() {
    this.isCollapsed = true;
    const { height } = this.headerEl.getBoundingClientRect();
    this.headerEl.style.transform = `translateY(-${height}px)`;
    this.bodyEl.style.transform = `translateY(-${height}px)`;
  }

  expand() {
    this.isCollapsed = false;
    this.headerEl.style.transform = `translateY(0)`;
    this.bodyEl.style.transform = `translateY(0)`;
  }

  private onTabClicked(tab: TabInterface) {
    if (this.selectedTab == tab) {
      this.isCollapsed ? this.expand() : this.collapse();
    } else {
      this.collapse();
      this.onTabSelected(tab);
    }
  }

  private onTabSelected(tab: TabInterface) {
    this.selectedTab = tab;
    const selectedIdx = this.tabs.findIndex(t => t === this.selectedTab);

    if (this.tabsEls[selectedIdx - 1]) {
      const { x } = this.tabsEls[selectedIdx - 1].headerEl.getBoundingClientRect();
      if (x < 0) {
        this.bodyEl.firstChild.scrollTo({
          left: this.bodyEl.firstChild.scrollLeft + x,
          top: 0,
          behavior: 'smooth',
        });
      }
    }
    if (this.tabsEls[selectedIdx + 1]) {
      const { x, width: elWidth } = this.tabsEls[selectedIdx + 1].headerEl.getBoundingClientRect();
      const { width: tabsWidth } = this.bodyEl.getBoundingClientRect();
      if (x + elWidth > tabsWidth) {
        this.bodyEl.firstChild.scrollTo({
          left: this.bodyEl.firstChild.scrollLeft - (tabsWidth - x - elWidth),
          top: 0,
          behavior: 'smooth',
        });
      }
    }

    if (this.tabsEls[selectedIdx]) {
      const { x, width: elWidth } = this.tabsEls[selectedIdx].headerEl.getBoundingClientRect();
      const { width: tabsWidth } = this.bodyEl.getBoundingClientRect();
      if (x < 0) {
        this.bodyEl.firstChild.scrollTo({
          left: this.bodyEl.firstChild.scrollLeft + x,
          top: 0,
          behavior: 'smooth',
        });
      } else if (x + elWidth > tabsWidth) {
        this.bodyEl.firstChild.scrollTo({
          left: this.bodyEl.firstChild.scrollLeft - (tabsWidth - x - elWidth),
          top: 0,
          behavior: 'smooth',
        });
      }
    }

    this.swiper?.slideTo(selectedIdx);
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

  render() {
    return (
      <Host>
        <div class="header" ref={el => (this.headerEl = el)}>
          {this.renderHeader()}
        </div>
        <div class="body" ref={el => (this.bodyEl = el)}>
          <div class="ftb-c-tabs__header">
            {this.tabs.map(t => (
              <buton
                class={'ftb-c-tabs__header-tab ' + (this.selectedTab == t ? 'selected' : '')}
                onClick={() => this.onTabClicked(t)}
              >
                {t.title()}
              </buton>
            ))}
          </div>
          <div class="ftb-c-tabs__body swiper" ref={el => (this.swiperEl = el)}>
            <div class="swiper-wrapper">
              {this.tabs.map(t => (
                <div class={'ftb-c-tabs__body-tab swiper-slide ' + (this.selectedTab == t ? ' selected' : '')}>
                  <div class="inner">{t.body()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
