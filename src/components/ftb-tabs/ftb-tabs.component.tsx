import { Component, Host, h, Prop, State } from '@stencil/core';
@Component({
  tag: 'ftb-tabs',
  styleUrl: 'ftb-tabs.component.scss',
  shadow: false,
})
export class FtbTabs {
  @Prop() tabs!: Array<{ renderTitle: () => string; renderContent: () => string }>;
  @Prop() hideSingleTab = true;
  @State() currentTab = 0;

  private onTabClicked(idx: number) {
    if (this.currentTab !== idx) {
      this.currentTab = idx;
    }
  }

  render() {
    if (!this.tabs) return null;

    return (
      <Host>
        <div class="ftb-tab-titles">
          {this.tabs.map((t, idx) => (
            <div
              class={{ 'ftb-tab-title': true, 'selected': idx === this.currentTab }}
              onClick={() => this.onTabClicked(idx)}
            >
              {t.renderTitle()}
            </div>
          ))}
        </div>
        <div class="ftb-tab-content">{this.tabs[this.currentTab].renderContent()}</div>
      </Host>
    );
  }
}
