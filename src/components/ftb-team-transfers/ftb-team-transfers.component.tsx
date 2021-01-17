import { Component, h, Host, Prop } from '@stencil/core';
import { AsyncSubject } from 'rxjs';
import { filter, TransferRequest, translations, Team, userState, TeamService, diState } from 'ftb-models';
import { CategoryInterface } from '../ftb-searchable-content/ftb-searchable-content.component';

@Component({
  tag: 'ftb-team-transfers',
  styleUrl: 'ftb-team-transfers.component.scss',
  shadow: false,
})
export class FtbTeamTransfers {
  @Prop() team!: Team;
  private ready$ = new AsyncSubject();

  componentWillLoad() {
    new TeamService(diState.gql).loadTeamTransfers(this.team._id).then(t => {
      this.team.transfers = t.transfers;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    return (
      <Host>
        <div class="ftb-team-transfers__wrapper">
          <div class="ftb-team-transfers__background">{this.renderContent()}</div>
        </div>
      </Host>
    );
  }

  private renderContent() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      let items = this.team.transfers.items;
      const direction = (categories.find(c => c.key === 'direction') as CategoryInterface)?.options.find(
        o => o.selected,
      )?.key;
      if (direction === 'incoming') {
        items = items.filter(t => t.toTeam?._id === this.team._id);
      } else if (direction === 'outgoing') {
        items = items.filter(t => t.toTeam?._id !== this.team._id);
      }
      filtersOn = Boolean(query) || direction;
      if (!filtersOn) return items;
      await this.ready$.toPromise();
      return filter(items, query, ['fromTeam.name', 'toTeam.name', 'player.firstName', 'player.lastName']);
    };

    const categories = [
      {
        key: 'direction',
        placeholder: translations.search.search[userState.language],
        filterFn: (query, options) => filter(options, query, ['text']),
        renderItem: i => i.text,
        options: [
          { text: translations.transfers.all_transfers[userState.language] },
          { key: 'incoming', text: translations.transfers.direction.incoming[userState.language] },
          { key: 'outgoing', text: translations.transfers.direction.outgoing[userState.language] },
        ],
      },
    ];

    return (
      <ftb-searchable-content
        items={this.team.transfers.items}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.team.transfers.total}
            items={items}
            renderItem={t => this.renderTransfer(t)}
            rows={2}
            itemMinWidthPx={266}
            itemMinHeightPx={60}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.game.search_by_game_teams[userState.language]}
        categories={categories}
      ></ftb-searchable-content>
    );
  }

  private renderTransfer(t: TransferRequest) {
    return (
      <ftb-link
        route="player"
        params={{ playerId: t.player._id, playerName: t.player.firstName + ' ' + t.player.lastName }}
      >
        <div class="ftb-team-transfers__transfer">
          <div class="ftb-team-transfers__transfer-background">
            <div class="photo">
              <ftb-player-photo player={t.player} key={t.player._id}></ftb-player-photo>
            </div>
            <div class="info">
              <div class="name">
                {t.player.firstName} {t.player.lastName}
              </div>
              <div class="type">
                {translations.transfers.types[t.type][userState.language]}
                {t.fromTeam?._id && t.fromTeam._id != this.team._id && (
                  <span>
                    {translations.transfers.direction.from[userState.language]}
                    <ftb-team-logo team={t.fromTeam}></ftb-team-logo>
                  </span>
                )}
                {t.toTeam?._id && t.toTeam._id != this.team._id && (
                  <span>
                    {translations.transfers.direction.to[userState.language]}
                    <ftb-team-logo team={t.toTeam}></ftb-team-logo>
                  </span>
                )}
              </div>
            </div>
            <div class="date-time">
              <div class="date">{t.adminConfirmedDate.format('DD.MM.YYYY')}</div>
              <div class="time">{t.adminConfirmedDate.format('HH:mm')}</div>
            </div>
          </div>
        </div>
      </ftb-link>
    );
  }
}
