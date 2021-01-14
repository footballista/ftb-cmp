import { Component, Host, h, Prop } from '@stencil/core';
import { AsyncSubject } from 'rxjs';
import { filter, TransferRequest, translations, Player, PlayerService, userState, diState } from 'ftb-models';
import Chevron from '../../assets/icons/chevron-down.svg';

@Component({
  tag: 'ftb-player-transfers',
  styleUrl: 'ftb-player-transfers.component.scss',
  shadow: false,
})
export class FtbPlayerTransfers {
  @Prop() player!: Player;
  private ready$ = new AsyncSubject();

  componentWillLoad() {
    new PlayerService(diState.gql).loadPlayerTransfers(this.player._id).then(p => {
      this.player.transfers = p.transfers;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      const items = this.player.transfers.items;
      filtersOn = Boolean(query);
      if (!filtersOn) return items;
      await this.ready$.toPromise();
      return filter(items, query, ['fromTeam.name', 'toTeam.name']);
    };

    return (
      <Host>
        <div class="ftb-player-transfers__wrapper">
          <div class="ftb-player-transfers__background">
            <ftb-searchable-content
              items={this.player.transfers.items}
              renderItems={items => (
                <ftb-pagination
                  totalItems={filtersOn ? items.length : this.player.transfers.total}
                  items={items}
                  renderItem={t => this.renderTransfer(t)}
                  rows={1}
                  itemMinWidthPx={266}
                  itemHeightPx={60}
                ></ftb-pagination>
              )}
              filterFn={filterFn}
              placeholder={translations.team.search_by_team_name[userState.language]}
              categories={[]}
            ></ftb-searchable-content>
          </div>
        </div>
      </Host>
    );
  }

  private renderTransfer(t: TransferRequest) {
    return (
      <div class="ftb-player-transfers__transfer">
        <div class="ftb-player-transfers__transfer-background">
          <div class="teams">
            {t.fromTeam && <ftb-team-logo team={t.fromTeam} key={t.fromTeam._id}></ftb-team-logo>}
            {t.fromTeam && t.toTeam && <ftb-icon class="chevron-icon" svg={Chevron}></ftb-icon>}
            {t.toTeam && <ftb-team-logo team={t.toTeam} key={t.toTeam._id}></ftb-team-logo>}
          </div>
          <div class="type">{translations.transfers.types[t.type][userState.language]}</div>
          <div class="date-time">
            <div class="date">{t.adminConfirmedDate.format('DD.MM.YYYY')}</div>
            <div class="time">{t.adminConfirmedDate.format('HH:mm')}</div>
          </div>
        </div>
      </div>
    );
  }
}
