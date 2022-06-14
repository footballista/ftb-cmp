import { Component, h } from '@stencil/core';
import { envState, routingState } from 'ftb-models';
import { environment } from '@src/environments/environment';
import '@ionic/core';
import { createRouter, Route, href } from 'stencil-router-v2';
const Router = createRouter();

import { fromEvent } from 'rxjs';
import { menuController } from '@ionic/core';

@Component({
  tag: 'ftb-showcase-page',
  styleUrl: 'ftb-showcase-page.component.scss',
  shadow: false,
})
export class FtbShowcasePage {
  components = [
    {
      title: 'Images and logos',
      items: [
        'ftb-team-logo',
        'ftb-player-photo',
        'ftb-user-photo',
        'ftb-stadium-photo',
        'ftb-post-photo',
        'ftb-video-cover',
        'ftb-league-logo',
        'ftb-league-sports-icon',
        'ftb-flag',
        'ftb-partner-photo',
        'ftb-country-photo',
      ],
    },
    { title: 'Stage', items: ['ftb-stage-table', 'ftb-stage-cup-net', 'ftb-cup-net-explorer'] },
    { title: 'Game', items: ['ftb-game-tour', 'ftb-game-state', 'ftb-game-photo-gallery'] },
    {
      title: 'Content',
      items: [
        'ftb-searchable-content',
        'ftb-pagination',
        'ftb-infinite-scroll',
        'ftb-virtual-scroll',
        'ftb-virtual-viewport',
        'ftb-tabs',
        'ftb-collapsible-tabs',
      ],
    },
    { title: 'Advertisement', items: ['ftb-partner-banner'] },
    { title: 'Other', items: ['ftb-icon', 'ftb-spinner', 'ftb-datepicker'] },
  ];

  componentWillLoad() {
    envState.imgHost = environment.imgHost;
    envState.apiHost = environment.apiHost;
    envState.localHost = environment.localHost;
    envState.graphqlHost = environment.graphqlHost;
    envState.appKey = 'AFL_RU';

    routingState.routes = {};

    function getViewportSize() {
      const object = 'innerWidth' in window ? window : document.documentElement || document.body;
      const prefix = 'innerWidth' in window ? 'inner' : 'client';
      return { width: object[prefix + 'Width'], height: object[prefix + 'Height'] };
    }

    const setMode = () => {
      envState.platform = getViewportSize().width > 800 ? 'web' : 'ios';
    };
    fromEvent(window, 'resize').subscribe(() => setMode());
    setMode();
  }

  connectedCallback() {
    setTimeout(() => {
      for (const category of this.components) {
        for (const component of category.items) {
          const page = Object.assign(document.createElement(component + '-stories'), { prefetchMode: true });
          document.body.appendChild(page);
          page.remove();
        }
      }
    }, 500);
  }

  render() {
    return envState.platform == 'web' ? this.renderDesktop() : this.renderMobile();
  }

  renderDesktop() {
    return (
      <ion-app class="desktop">
        <div class="menu">
          <div class="header">
            <a {...href('/')} class="main-link">
              Ftb-Components
            </a>
            <ftb-searchable-content
              items={this.components}
              filterFn={async (items, query) => {
                if (!query.trim()) return items;
                query = query.toLowerCase().trim();
                const result = items
                  .filter(
                    cat =>
                      cat.title.toLowerCase().includes(query) || cat.items.some(i => i.toLowerCase().includes(query)),
                  )
                  .map(cat => {
                    if (cat.title.toLowerCase().includes(query)) {
                      return cat;
                    } else {
                      return { title: cat.title, items: cat.items.filter(i => i.toLowerCase().includes(query)) };
                    }
                  });
                return result;
              }}
              placeholder="Find components"
              renderItems={categories =>
                categories.map(cat => (
                  <div class="category">
                    <h6>{cat.title}</h6>
                    {/*{...cat.items.map(i => <stencil-route-link url={'/' + i}>{i}</stencil-route-link>)}*/}
                    {...cat.items.map(i => <a {...href('/' + i)}>{i}</a>)}
                  </div>
                ))
              }
              debounce={0}
            />
          </div>
        </div>
        <div class="content">
          {this.renderRoutes()}
          {/*<ion-nav animated={false} />*/}
          <div class="content-fog" />
        </div>
      </ion-app>
    );
  }

  renderMobile() {
    return (
      <ion-app class="mobile">
        <ion-menu side="start" content-id="main-content" class="menu" menuId="main">
          <ion-content>
            <div class="header">
              <a {...href('/')} class="main-link" onClick={() => menuController.close('main')}>
                Ftb-Components
              </a>
            </div>
            <ftb-searchable-content
              items={this.components}
              filterFn={async (items, query) => {
                if (!query.trim()) return items;
                query = query.toLowerCase().trim();
                const result = items
                  .filter(
                    cat =>
                      cat.title.toLowerCase().includes(query) || cat.items.some(i => i.toLowerCase().includes(query)),
                  )
                  .map(cat => {
                    if (cat.title.toLowerCase().includes(query)) {
                      return cat;
                    } else {
                      return { title: cat.title, items: cat.items.filter(i => i.toLowerCase().includes(query)) };
                    }
                  });
                return result;
              }}
              placeholder="Find components"
              renderItems={categories =>
                categories.map(cat => (
                  <div class="category">
                    <h6>{cat.title}</h6>
                    {...cat.items.map(i => <a {...href('/' + i)}>{i}</a>)}
                  </div>
                ))
              }
              debounce={0}
            />
          </ion-content>
        </ion-menu>

        <div class="ion-page" id="main-content">
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-button>
                  <ion-menu-button />
                </ion-button>
              </ion-buttons>
              <ion-title>Ftb-Components</ion-title>
            </ion-toolbar>
          </ion-header>
          {/*<ion-content class="ion-padding">{this.renderRoutes()}</ion-content>*/}
          <div class="content">{this.renderRoutes()}</div>
        </div>
      </ion-app>
    );
  }

  renderRoutes() {
    return (
      <Router.Switch>
        <Route path="/" render={() => <ftb-showcase-main />} />
        {this.components
          .reduce((cmps, category) => [...cmps, ...category.items], [])
          .map(c => (
            <Route
              path={'/' + c}
              render={() => {
                const Cmp = c + '-stories';
                return <Cmp />;
              }}
            />
          ))}
      </Router.Switch>
    );
  }
}
