import { Component, Host, h } from '@stencil/core';
import { Team } from 'ftb-models/dist/models/team.model';

/**
 * Test page that demonstrates all existing components
 */
@Component({
  tag: 'cmp-test',
  styleUrl: 'cmp-test.component.scss',
  shadow: true,
})
export class CmpTest {
  render() {
    const elements: Array<{ descr: string; e: any }> = [];

    elements.push({
      descr: 'team logo with object',
      e: () => <ftb-team-logo team={new Team({ logo: 'Millwall', logoId: 2 })}></ftb-team-logo>,
    });
    elements.push({
      descr: 'team logo with separate values',
      e: () => <ftb-team-logo logo="Millwall" version={2}></ftb-team-logo>,
    });
    elements.push({
      descr: 'team logo with incorrect logo',
      e: () => <ftb-team-logo team={new Team({ logo: 'not_existing_logo', logoId: 1 })}></ftb-team-logo>,
    });

    return (
      <Host>
        {elements.map(el => (
          <div class="case">
            <p>{el.descr}</p>
            {el.e()}
          </div>
        ))}
      </Host>
    );
  }
}
