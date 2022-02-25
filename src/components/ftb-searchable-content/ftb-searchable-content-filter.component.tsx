import { Component, EventEmitter, h, Host, Method, Prop, State, Event, Element, forceUpdate } from '@stencil/core';

export interface CategoryInterface {
  key: string;
  placeholder?: string;
  filterFn: (query: string, options: CategoryInterface['options']) => CategoryInterface['options'];
  renderItem: (item: CategoryInterface['options'][0]) => string;
  title?: string;
  options: any;
  filteredOptions?: any;
  open?: boolean;
  inputEl?: HTMLInputElement;
  lsKey?: string;
}

@Component({
  tag: 'ftb-searchable-content-filter',
  styleUrl: 'ftb-searchable-content-filter.component.scss',
  shadow: false,
})
export class FtbSearchableContentFilter {
  @Prop() categories: CategoryInterface[];
  @Event() selected: EventEmitter;
  @State() isOpen;
  @Element() el: HTMLElement;

  @Method() async open() {
    this.isOpen = true;
  }

  selectOption(c: CategoryInterface, o: CategoryInterface['options'][0]) {
    c.options.forEach(opt => (opt.selected = opt.focused = false));
    o.selected = true;
    c.open = false;
    forceUpdate(this.el);
    this.selected.emit(this.categories);
  }

  render() {
    return (
      <Host class={this.isOpen ? 'open' : ''}>
        <div class={'backdrop ' + (this.isOpen ? 'open' : '')} onClick={() => (this.isOpen = false)} />
        <div class={'options-container mobile ' + (this.isOpen ? 'open' : '')}>
          {this.categories?.map(c => [
            <div class="category-title">{c.title}</div>,
            c.filteredOptions.map(o => (
              <div class="option-wrapper">
                <div class={{ option: true, focused: o.focused }} onClick={() => this.selectOption(c, o)}>
                  {c.renderItem(o)}
                  <div class={'radio ' + (o.selected ? 'selected' : '')} />
                </div>
              </div>
            )),
          ])}
          <button class="confirm-button" onClick={() => (this.isOpen = false)} />
        </div>
      </Host>
    );
  }
}
