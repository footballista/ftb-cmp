import { Component, Host, h, State } from '@stencil/core';
import { Team } from 'ftb-models/dist/models/team.model';
import { User } from 'ftb-models/dist/models/user.model';
import { Player } from 'ftb-models/dist/models/player.model';
import range from 'lodash-es/range';
import { Collection } from 'ftb-models/dist/models/base/collection';
import { CategoryInterface } from '@src/components/ftb-searchable-content/ftb-searchable-content.component';
import { filter, Game, GamePhoto, GamePhotoImg } from 'ftb-models';
import { GraphqlClient } from 'ftb-models/dist/tools/clients/graphql.client';
import { HttpClient } from 'ftb-models/dist/tools/clients/http.client';
import { GameService } from 'ftb-models/dist/services/game.service';

/**
 * Test page that demonstrates all existing components
 */
@Component({
  tag: 'cmp-showcase',
  styleUrl: 'cmp-showcase.component.scss',
  shadow: true,
})
export class CmpTest {
  @State() updateSignal = 0;

  private data = {
    improvingCollection: new Collection({ total: 12, items: range(7) }),
    game: new Game({ _id: 313299 }),
    showGallery: false,
    galleryIdx: 0,
  };

  async componentWillLoad() {
    const gql = new GraphqlClient(new HttpClient('AFL_RU', new User()), 'http://localhost:3004/graphql/');
    this.data.game = await new GameService(gql).loadFullGameInfo(this.data.game._id);
    setTimeout(() => {
      this.data.improvingCollection.items = range(12);
      this.updateSignal++;
    }, 10000);
  }

  render() {
    const components: Array<{
      title: string;
      elements: Array<{ descr: string; e: any }>;
      caseStyle?: { [key: string]: string };
    }> = [
      this.teamLogo(),
      this.userPhoto(),
      this.playerPhoto(),
      this.photoGallery(),
      this.improvingImg(),
      this.gamePhotoPreview(),
      this.pagination(),
      this.paginationWithCollection(),
      this.search(),
      this.tabs(),
    ];

    return (
      <Host>
        {components.map(c => (
          <div class="component">
            <h4>{c.title}</h4>
            <div class="elements">
              {c.elements.map(el => (
                <div class="case" style={c.caseStyle || {}}>
                  {el.e()}
                  <p>{el.descr}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Host>
    );
  }

  private teamLogo() {
    return {
      title: 'Team logo',
      elements: [
        {
          descr: 'Argument object',
          e: () => <ftb-team-logo team={new Team({ logo: 'Millwall', logoId: 2 })}></ftb-team-logo>,
        },
        {
          descr: 'Separate arguments',
          e: () => <ftb-team-logo logo="Millwall" version={2}></ftb-team-logo>,
        },
        {
          descr: 'Incorrect logo',
          e: () => <ftb-team-logo team={new Team({ logo: 'not_existing_logo', logoId: 1 })}></ftb-team-logo>,
        },
      ],
    };
  }

  private userPhoto() {
    return {
      title: 'User photo',
      elements: [
        {
          descr: 'Argument object',
          e: () => <ftb-user-photo user={new User({ _id: 1, photoId: 1 })}></ftb-user-photo>,
        },
        {
          descr: 'Separate object',
          e: () => <ftb-user-photo user-id={1} version={2}></ftb-user-photo>,
        },
        {
          descr: 'Incorrect photo',
          e: () => <ftb-user-photo user-id={-1} version={2}></ftb-user-photo>,
        },
      ],
    };
  }

  private playerPhoto() {
    return {
      title: 'Player photo',
      elements: [
        {
          descr: 'Argument object',
          e: () => <ftb-player-photo player={new Player({ _id: 1, photoId: 1 })}></ftb-player-photo>,
        },
        {
          descr: 'Separate object',
          e: () => <ftb-player-photo player-id={1} version={2}></ftb-player-photo>,
        },
        {
          descr: 'Incorrect photo',
          e: () => <ftb-player-photo player-id={-1} version={2}></ftb-player-photo>,
        },
      ],
    };
  }

  private improvingImg() {
    return {
      title: 'Improving image',
      elements: [
        {
          descr: 'Simple case',
          e: () => (
            <ftb-improving-img
              sources={[
                'https://img.youtube.com/vi/ehZwZ-iotGo/default.jpg',
                'https://img.youtube.com/vi/ehZwZ-iotGo/sddefault.jpg',
                'https://sun9-72.userapi.com/c855136/v855136020/23a475/AGI_Y0YT3fk.jpg',
              ]}
            ></ftb-improving-img>
          ),
        },
      ],
    };
  }

  private pagination() {
    const renderItem = (item: number) => <div class="pag-item">{item}</div>;
    const rows = 2;
    const itemMinWidthPx = 100;
    const itemHeightPx = 54;

    return {
      title: 'Pagination',
      caseStyle: { flex: '1' },
      elements: [
        {
          descr: 'wide',
          e: () => (
            <ftb-pagination
              totalItems={12}
              items={range(12)}
              renderItem={renderItem}
              rows={rows}
              itemMinWidthPx={itemMinWidthPx}
              itemHeightPx={itemHeightPx}
            ></ftb-pagination>
          ),
        },
        {
          descr: 'narrow',
          e: () => (
            <ftb-pagination
              totalItems={12}
              items={range(12)}
              renderItem={renderItem}
              rows={rows}
              itemMinWidthPx={itemMinWidthPx}
              itemHeightPx={itemHeightPx}
              style={{ 'max-width': '300px' }}
            ></ftb-pagination>
          ),
        },
        {
          descr: 'many pages',
          e: () => (
            <ftb-pagination
              totalItems={120}
              items={range(120)}
              renderItem={renderItem}
              rows={rows}
              itemMinWidthPx={itemMinWidthPx}
              itemHeightPx={itemHeightPx}
              style={{ 'max-width': '300px' }}
            ></ftb-pagination>
          ),
        },
      ],
    };
  }

  private paginationWithCollection() {
    const renderItem = (item: number) => <div class="pag-item">{item}</div>;
    const rows = 2;
    const itemMinWidthPx = 100;
    const itemHeightPx = 54;

    return {
      title: 'Pagination with partially loaded collection',
      elements: [
        {
          descr: 'loaded 7 of 12',
          e: () => (
            <ftb-pagination
              totalItems={12}
              items={range(7)}
              renderItem={renderItem}
              rows={rows}
              itemMinWidthPx={itemMinWidthPx}
              itemHeightPx={itemHeightPx}
              style={{ 'max-width': '300px' }}
            ></ftb-pagination>
          ),
        },
        {
          descr: '7/12, rest loaded in 10 sec.',
          e: () => this.createImprovedPagination(),
        },
      ],
    };
  }

  private createImprovedPagination() {
    const renderItem = (item: number) => <div class="pag-item">{item}</div>;
    const rows = 2;
    const itemMinWidthPx = 100;
    const itemHeightPx = 54;

    return (
      <ftb-pagination
        totalItems={this.data.improvingCollection.total}
        items={this.data.improvingCollection.items}
        renderItem={renderItem}
        rows={rows}
        itemMinWidthPx={itemMinWidthPx}
        itemHeightPx={itemHeightPx}
        style={{ 'max-width': '300px', 'min-width': '300px' }}
      ></ftb-pagination>
    );
  }

  private tabs() {
    return {
      title: 'Tabs',
      caseStyle: { 'height': '229px', 'justify-content': 'flex-start' },
      elements: [
        {
          descr: 'With paginated content',
          e: () => (
            <ftb-tabs
              tabs={[
                { renderTitle: () => 'First', renderContent: () => this.createImprovedPagination() },
                { renderTitle: () => 'Second', renderContent: () => <div>second tab</div> },
              ]}
            ></ftb-tabs>
          ),
        },
        {
          descr: 'With search',
          e: () => (
            <ftb-tabs
              tabs={[
                { renderTitle: () => 'First', renderContent: () => this.search().elements[1].e() },
                { renderTitle: () => 'Second', renderContent: () => <div>second tab</div> },
              ]}
            ></ftb-tabs>
          ),
        },
      ],
    };
  }

  private search() {
    const filterFn = (items: number[], query: string, categories: CategoryInterface[]) => {
      const oddevenVal = categories.find(c => c.key === 'oddeven').options.find(o => o.selected).key;
      if (oddevenVal === 'odd') items = items.filter(i => i % 2);
      if (oddevenVal === 'even') items = items.filter(i => !(i % 2));
      return Promise.resolve(query ? items.filter(i => (i + '').includes(query)) : items);
    };

    return {
      title: 'Search',
      elements: [
        {
          descr: 'Search numbers',
          e: () => (
            <ftb-searchable-content
              items={range(50)}
              renderItems={items => (
                <div style={{ 'display': 'flex', 'flex-wrap': 'wrap', 'justify-content': 'center' }}>
                  {items.map(i => (
                    <span class="content-item">{i}</span>
                  ))}
                </div>
              )}
              filterFn={filterFn}
              placeholder="Search by number"
              categories={[
                {
                  key: 'oddeven',
                  placeholder: 'Filter',
                  filterFn: (query, options) => filter(options, query, ['text']),
                  renderItem: i => i.text,
                  options: [
                    { key: 'all', text: 'All items' },
                    { key: 'odd', text: 'Odd' },
                    { key: 'even', text: 'Even' },
                  ],
                },
              ]}
            ></ftb-searchable-content>
          ),
        },
        {
          descr: 'With pagination',
          e: () => (
            <ftb-searchable-content
              items={range(50)}
              renderItems={items => {
                return (
                  <ftb-pagination
                    totalItems={items.length}
                    items={items}
                    renderItem={(item: number) => <div class="pag-item">{item}</div>}
                    rows={2}
                    itemMinWidthPx={100}
                    itemHeightPx={54}
                  ></ftb-pagination>
                );
              }}
              filterFn={filterFn}
              placeholder="Search by number"
              categories={[
                {
                  key: 'oddeven',
                  placeholder: 'Filter',
                  filterFn: (query, options) => filter(options, query, ['text']),
                  renderItem: i => i.text,
                  options: [
                    { key: 'all', text: 'All items' },
                    { key: 'odd', text: 'Odd' },
                    { key: 'even', text: 'Even' },
                  ],
                },
              ]}
            ></ftb-searchable-content>
          ),
        },
      ],
    };
  }

  private gamePhotoPreview() {
    return {
      title: 'Game photo preview',
      elements: [
        {
          descr: 'small',
          e: () => (
            <ftb-game-photo-preview
              photo={this.data.game.photoset.photos[0]}
              style={{ height: '50px', width: '100px' }}
            ></ftb-game-photo-preview>
          ),
        },
        {
          descr: 'big',
          e: () => (
            <ftb-game-photo-preview
              photo={this.data.game.photoset.photos[0]}
              style={{ height: '100px', width: '200px' }}
            ></ftb-game-photo-preview>
          ),
        },
        {
          descr: 'incorrect',
          e: () => (
            <ftb-game-photo-preview
              photo={{
                thumb: new GamePhotoImg(
                  'https://sun9-10.userapi.com/impf/c851536/v851536702/15a74a/incorrect.jpg?size=1280x948&quality=96&sign=ffa05f7d2b59768d20eb91756d1a87fd&c_uniq_tag=muP6oinQviXYTcY30xJpPaTl5czvWHNwJXqCc01bJQA',
                ),
                middle: new GamePhotoImg(
                  'https://sun9-10.userapi.com/impf/c851536/v851536702/15a74a/incorrect.jpg?size=1280x948&quality=96&sign=ffa05f7d2b59768d20eb91756d1a87fd&c_uniq_tag=muP6oinQviXYTcY30xJpPaTl5czvWHNwJXqCc01bJQA',
                ),
                full: null,
                hd: null,
              }}
              style={{ height: '100px', width: '200px' }}
            ></ftb-game-photo-preview>
          ),
        },
      ],
    };
  }

  private photoGallery() {
    const open = (photo: GamePhoto) => {
      const idx = this.data.game.photoset.photos.findIndex(p => p.thumb === photo.thumb);
      this.data.galleryIdx = idx;
      this.data.showGallery = true;
      this.updateSignal++;
    };

    const close = () => {
      this.data.showGallery = false;
      this.updateSignal++;
    };

    return {
      title: 'photo-gallery',
      elements: [
        {
          descr: 'basic',
          e: () => (
            <div class="photo-gallery">
              {this.data.showGallery && (
                <ftb-photo-gallery
                  game={this.data.game}
                  onClosed={() => close()}
                  start={this.data.galleryIdx}
                ></ftb-photo-gallery>
              )}
              <ftb-pagination
                totalItems={this.data.game.photoset.photos.length}
                items={this.data.game.photoset.photos}
                renderItem={i => (
                  <ftb-game-photo-preview
                    photo={i}
                    style={{ height: '96px', width: '130px' }}
                    onClick={() => open(i)}
                  ></ftb-game-photo-preview>
                )}
                rows={2}
                itemMinWidthPx={130}
                itemHeightPx={96}
              ></ftb-pagination>
            </div>
          ),
        },
      ],
    };
  }
}
