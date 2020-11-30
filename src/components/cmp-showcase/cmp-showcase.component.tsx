import { Component, Host, h } from '@stencil/core';
import { Team } from 'ftb-models/dist/models/team.model';
import { User } from 'ftb-models/dist/models/user.model';
import { Player } from 'ftb-models/dist/models/player.model';
import range from 'lodash-es/range';

/**
 * Test page that demonstrates all existing components
 */
@Component({
  tag: 'cmp-showcase',
  styleUrl: 'cmp-showcase.component.scss',
  shadow: true,
})
export class CmpTest {
  render() {
    const components: Array<{
      title: string;
      elements: Array<{ descr: string; e: any }>;
      caseStyle?: { [key: string]: string };
    }> = [this.teamLogo(), this.userPhoto(), this.playerPhoto(), this.improvingImg(), this.content()];

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

  private content() {
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
}
