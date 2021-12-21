import { Component, h } from '@stencil/core';
import { envState } from 'ftb-models';
import { environment } from '@src/environments/environment';
import '@ionic/core';
import { fromEvent } from 'rxjs';

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
      ],
    },
    { title: 'Game', items: ['ftb-game-tour', 'ftb-game-state', 'ftb-game-photo-gallery'] },
    { title: 'Content', items: ['ftb-pagination', 'ftb-infinite-scroll'] },
    { title: 'Other', items: ['ftb-spinner'] },
  ];

  componentWillLoad() {
    envState.imgHost = environment.imgHost;
    envState.apiHost = environment.apiHost;
    envState.graphqlHost = environment.graphqlHost;

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

  render() {
    return envState.platform == 'web' ? this.renderDesktop() : this.renderMobile();
  }

  renderDesktop() {
    return (
      <ion-app class="desktop">
        <div class="menu">
          <div class="header">
            <ion-router-link href="/" class="main-link">
              Ftb-Components
            </ion-router-link>
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
                    {...cat.items.map(i => <ion-router-link href={'/' + i}>{i}</ion-router-link>)}
                  </div>
                ))
              }
              debounce={0}
            />
          </div>
        </div>
        <div class="content">
          {this.renderRoutes()}
          <div class="content-fog" />
          <ion-nav />
        </div>
      </ion-app>
    );
  }

  renderMobile() {
    return (
      <ion-app>
        <ion-menu side="start" content-id="main-content">
          <ion-header>
            <ion-toolbar>
              <ion-title>Menu</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <ion-router-link href="/" className="main-link">
              Ftb-Components
            </ion-router-link>

            <ion-list>
              {this.components.map(cat => (
                <div class="category">
                  <h6>{cat.title}</h6>
                  {...cat.items.map(i => (
                    <ion-item>
                      <ion-router-link href={'/' + i}>{i}</ion-router-link>
                    </ion-item>
                  ))}
                </div>
              ))}
            </ion-list>
          </ion-content>
        </ion-menu>

        <div class="ion-page" id="main-content">
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-menu-button />
              </ion-buttons>
              <ion-title>Inbox</ion-title>
            </ion-toolbar>
          </ion-header>
          {this.renderRoutes()}
          <ion-nav />
        </div>
      </ion-app>
    );
  }

  renderRoutes() {
    return (
      <ion-router useHash={false}>
        <ion-route url={'/'} component={'ftb-showcase-main'} />
        {this.components
          .reduce((cmps, category) => [...cmps, ...category.items], [])
          .map(c => (
            <ion-route url={'/' + c} component={c + '-stories'} />
          ))}
      </ion-router>
    );
  }
}
