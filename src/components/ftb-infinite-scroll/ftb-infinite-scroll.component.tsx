import { Component, Prop, State, Element, Host, h, forceUpdate, Build } from '@stencil/core';

@Component({
  tag: 'ftb-infinite-scroll',
  styleUrl: 'ftb-infinite-scroll.component.scss',
  shadow: false,
})
export class FtbInfiniteScrollComponent {
  /** method that is called when user scrolls to a component */
  @Prop() loadData!: () => Promise<any>;

  @State() loading: boolean = false;
  @State() error: boolean = false;

  @Element() el;

  io?: IntersectionObserver;

  componentDidLoad() {
    this.addIO();
  }

  addIO() {
    if (!Build.isBrowser) return;
    if (
      typeof (window as any) !== 'undefined' &&
      'IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'isIntersecting' in window.IntersectionObserverEntry.prototype
    ) {
      this.removeIO();
      this.io = new IntersectionObserver(data => {
        /**
         * On slower devices, it is possible for an intersection observer entry to contain multiple
         * objects in the array. This happens when quickly scrolling an image into view and then out of
         * view. In this case, the last object represents the current state of the component.
         */
        if (data[data.length - 1].isIntersecting) {
          this.removeIO();
          this.runDataLoad();
        }
      });

      this.io.observe(this.el);
    } else {
      throw new Error('Your browser does not suppoort Intersection observer :(');
    }
  }

  removeIO() {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }

  async runDataLoad() {
    this.loading = true;
    this.error = false;
    forceUpdate(this.el);
    try {
      await this.loadData();
      this.loading = false;
      this.addIO();
    } catch {
      this.loading = false;
      this.error = true;
    }
  }

  render() {
    return (
      <Host>
        {this.loading ? <ftb-spinner /> : null}
        {this.error ? (
          <div class="ftb-infinite-scroll__error-block">
            <div class="ftb-infinite-scroll__error-message">Failed to load data</div>
            <button onClick={() => this.runDataLoad()}>Try again</button>
          </div>
        ) : null}
      </Host>
    );
  }
}
