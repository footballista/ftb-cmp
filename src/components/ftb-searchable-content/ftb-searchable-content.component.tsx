import { Component, Host, h, Prop, State } from '@stencil/core';
import Search from '../../assets/icons/search.svg';
import { Subject, AsyncSubject, timer, merge } from 'rxjs';
import { takeUntil, tap, debounce, filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  tag: 'ftb-searchable-content',
  styleUrl: 'ftb-searchable-content.component.scss',
  shadow: false,
})
export class FtbSearchableContent {
  @Prop() items!: any[];
  @Prop() renderItems!: (items: any[]) => string;
  @Prop() filterFn!: (query: string, items: any[]) => Promise<any[]>;
  @Prop() placeholder!: string;
  @Prop() debounce = 300;
  @State() open = false;
  @State() filteredItems: any[];
  @State() searchInProgress = false;
  private inputEl: HTMLInputElement;
  private queryChanges$ = new Subject<string>();
  private onDestroyed$ = new AsyncSubject();
  private ready$ = new AsyncSubject();
  private inputDirty = false;

  async componentWillLoad() {
    this.subscribeToQueryChanges();
    this.queryChanges$.next('');
    await this.ready$.toPromise();
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
        tap(() => (this.searchInProgress = false)),
      ),
    )
      .pipe(distinctUntilChanged())
      .subscribe(async query => {
        this.filteredItems = query ? await this.filterFn(query, this.items) : this.items;
        this.searchInProgress = false;
        this.ready$.next(true);
        this.ready$.complete();
      });
  }

  disconnectedCallback() {
    this.onDestroyed$.next(true);
    this.onDestroyed$.complete();
  }

  private onKeyDown(e) {
    if (e.key === 'Escape') {
      this.inputEl.value = '';
      this.queryChanges$.next('');
    }
  }

  private onKeyUp(e) {
    this.queryChanges$.next(e.target.value);
  }

  private toggleOpen() {
    if (this.open) {
      this.open = false;
    } else {
      this.open = true;
      this.inputEl.focus();
    }
  }

  render() {
    return (
      <Host>
        <div class="ftb-searchable-content-search-line">
          <div class={{ 'input-wrapper': true, 'hidden': !this.open, 'dirty': this.inputDirty }}>
            <input
              placeholder={this.placeholder}
              ref={el => (this.inputEl = el)}
              onKeyUp={e => this.onKeyUp(e)}
              onKeyDown={e => this.onKeyDown(e)}
            />
          </div>
          <div class="button-wrapper">
            {this.searchInProgress ? (
              <ftb-spinner></ftb-spinner>
            ) : (
              <button class={{ 'open-search-button': true, 'open': this.open }} onClick={() => this.toggleOpen()}>
                <ftb-icon svg={Search}></ftb-icon>
              </button>
            )}
          </div>
        </div>
        <div class="ftb-searchable-content-content">{this.renderItems(this.filteredItems)}</div>
      </Host>
    );
  }
}
