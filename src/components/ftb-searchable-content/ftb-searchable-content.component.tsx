import { Component, Host, h, Prop, State, Event, EventEmitter, Element } from '@stencil/core';
import Chevron from '../../assets/icons/chevron-down.svg';
import { Subject, AsyncSubject, timer, merge } from 'rxjs';
import { takeUntil, tap, debounce, filter, distinctUntilChanged } from 'rxjs/operators';

export interface CategoryInterface {
  key: string;
  placeholder?: string;
  filterFn: (query: string, options: CategoryInterface['options']) => CategoryInterface['options'];
  renderItem: (item: CategoryInterface['options'][0]) => string;
  options: any;
  filteredOptions?: any;
  open?: boolean;
  inputEl?: HTMLInputElement;
}

@Component({
  tag: 'ftb-searchable-content',
  styleUrl: 'ftb-searchable-content.component.scss',
  shadow: false,
})
export class FtbSearchableContent {
  @Prop() items!: any[];
  @Prop() renderItems!: (items: any[]) => string | string[];
  @Prop() filterFn!: (items: any[], query: string, categories?: CategoryInterface[]) => Promise<any[]>;
  @Prop() placeholder!: string;
  @Prop() categories: CategoryInterface[];
  /** alternative to "categories" property. used when categories list should be updated on category change */
  @Prop() getCategories: (currentCategories?: CategoryInterface[]) => CategoryInterface[];
  @Prop() debounce = 300;
  @State() open = true;
  @State() filteredItems: any[];
  @State() searchInProgress = false;
  @Event() inputKeyDown: EventEmitter<KeyboardEvent>;
  @Element() element: HTMLElement;
  private inputEl: HTMLInputElement;
  private queryChanges$ = new Subject<string>();
  private categoryUpdated$ = new Subject();
  private onDestroyed$ = new AsyncSubject();
  private ready$ = new AsyncSubject();
  private inputDirty = false;
  private minHeightPx: number;

  async componentWillLoad() {
    if (this.getCategories) this.categories = this.getCategories();
    this.categoryDefaultSelect();
    this.subscribeToQueryChanges();
    this.queryChanges$.next('');
    await this.ready$.toPromise();
  }

  componentDidRender() {
    this.minHeightPx ??= this.element.offsetHeight;
  }

  async componentWillUpdate() {
    this.categoryDefaultSelect();
  }

  private categoryDefaultSelect() {
    this.categories?.forEach(c => {
      if (!c.options.some(o => o.selected)) c.options[0].selected = true;
      c.filteredOptions ??= [...c.options];
    });
  }

  private subscribeToQueryChanges() {
    merge(
      this.queryChanges$.pipe(
        takeUntil(this.onDestroyed$),
        tap(v => (this.searchInProgress = Boolean(v))),
        tap(v => (this.inputDirty = Boolean(v))),
        debounce(() => timer(this.debounce)),
      ),
      this.queryChanges$.pipe(
        takeUntil(this.onDestroyed$),
        filter(v => !Boolean(v)),
        tap(() => (this.inputDirty = false)),
      ),
    )
      .pipe(distinctUntilChanged())
      .subscribe(async () => {
        await this.search();
        this.ready$.next(true);
        this.ready$.complete();
      });

    this.categoryUpdated$.pipe(takeUntil(this.onDestroyed$)).subscribe(() => {
      return this.search();
    });
  }

  disconnectedCallback() {
    this.onDestroyed$.next(true);
    this.onDestroyed$.complete();
  }

  private async search() {
    this.searchInProgress = true;
    this.filteredItems = await this.filterFn(this.items, this.inputEl?.value || '', this.categories);
    this.searchInProgress = false;
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.inputEl.value = '';
      this.queryChanges$.next('');
    }
    this.inputKeyDown.emit(e);
  }

  private onKeyUp(e: KeyboardEvent) {
    this.queryChanges$.next(e.target['value']);
  }

  private onCategoryInputKeyDown(c: CategoryInterface, e: KeyboardEvent) {
    const focusedIdx = c.filteredOptions.findIndex(o => o.focused);
    if (e.key === 'ArrowDown') {
      if (focusedIdx + 1 < c.options.length) {
        c.filteredOptions.forEach(o => (o.focused = false));
        c.filteredOptions[focusedIdx + 1].focused = true;
        this.categories = [...this.categories];
      }
    } else if (e.key === 'ArrowUp') {
      if (focusedIdx > 0) {
        c.filteredOptions.forEach(o => (o.focused = false));
        c.filteredOptions[focusedIdx - 1].focused = true;
        this.categories = [...this.categories];
      }
    } else if (e.key === 'Enter') {
      if (focusedIdx > -1) {
        this.selectOption(c.filteredOptions[focusedIdx]);
      }
    }
  }

  private onCategoryInputKeyUp(c: CategoryInterface, e) {
    c.filteredOptions = c.filterFn(e.target.value, c.options);
    this.categories = [...this.categories];
  }

  private toggleCategory(c: CategoryInterface) {
    if (c.open) {
      c.open = false;
      this.categories = [...this.categories];
      this.inputEl.focus();
    } else {
      this.categories.forEach(ct => (ct.open = false));
      c.open = true;
      this.categories = [...this.categories];
      c.inputEl.focus();
    }
  }

  private selectOption(o: CategoryInterface['options'][0]) {
    const c = this.categories.find(c => c.open);
    if (c) {
      c.options.forEach(opt => (opt.selected = opt.focused = false));
      o.selected = true;
      c.open = false;
      if (this.getCategories) this.categories = this.getCategories(this.categories);
      this.categoryUpdated$.next();
    }
    this.inputEl.focus();
  }

  render() {
    return (
      <Host style={{ 'min-height': this.minHeightPx + 'px' }}>
        <div class="ftb-searchable-content-search-line">
          <div class={{ 'input-wrapper': true, 'hidden': !this.open, 'dirty': this.inputDirty }}>
            <div class="inputs">
              <input
                class={{ hidden: this.categories.some(c => c.open) }}
                placeholder={this.placeholder}
                ref={el => (this.inputEl = el)}
                onKeyUp={e => this.onKeyUp(e)}
                onKeyDown={e => this.onKeyDown(e)}
              />
              {this.categories.map(c => (
                <input
                  class={{ hidden: !c.open }}
                  placeholder={c.placeholder}
                  ref={el => (c.inputEl = el)}
                  onKeyUp={e => this.onCategoryInputKeyUp(c, e)}
                  onKeyDown={e => this.onCategoryInputKeyDown(c, e)}
                />
              ))}
              <ftb-spinner class={{ hidden: !this.searchInProgress }}></ftb-spinner>
            </div>
            {this.categories?.map(c => (
              <div class="category" onClick={() => this.toggleCategory(c)}>
                {c.renderItem(c.options.find(o => o.selected))}
                <ftb-icon svg={Chevron} class={{ open: c.open }}></ftb-icon>
              </div>
            ))}
          </div>
          {this.categories?.some(c => c.open) && (
            <div class="options-wrapper">
              {this.categories
                .find(c => c.open)
                .filteredOptions.map(o => (
                  <div class={{ option: true, focused: o.focused }} onClick={() => this.selectOption(o)}>
                    {this.categories.find(c => c.open).renderItem(o)}
                  </div>
                ))}
            </div>
          )}
        </div>
        <div class="ftb-searchable-content-content">{this.renderItems(this.filteredItems)}</div>
      </Host>
    );
  }
}
