import { Component, EventEmitter, h, Host, Method, Prop, State, Event, Element, forceUpdate } from '@stencil/core';
import { translations, userState } from 'ftb-models';

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
      <Host>
        <ion-modal
          onIonModalDidDismiss={() => {
            this.isOpen = false;
          }}
          mode="ios"
          isOpen={this.isOpen}
          breakpoints={[0, 0.6, 1]}
          initialBreakpoint={0.6}
          class={'ftb-searchable-content-filter-modal ' + this.el.classList.toString()}
        >
          <div class={'options-container mobile ' + (this.isOpen ? 'open' : '')}>
            <div class="categories-container">
              {this.categories?.map(c => [
                <div class="category-title">{c.title}</div>,
                <div class="category-options">
                  {c.filteredOptions.map(o => (
                    <div class="option-wrapper">
                      <div class={{ option: true, focused: o.focused }} onClick={() => this.selectOption(c, o)}>
                        {c.renderItem(o)}
                        <div class={'radio ' + (o.selected ? 'selected' : '')} />
                      </div>
                    </div>
                  ))}
                </div>,
              ])}
            </div>
          </div>
          <button class="select-button" onClick={() => (this.isOpen = false)}>
            {translations.navigation.done[userState.language]}
          </button>
        </ion-modal>
      </Host>
    );
  }
}
