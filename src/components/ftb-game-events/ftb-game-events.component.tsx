import { Component, Host, h, Prop } from '@stencil/core';
import { filter, Game, GameEvent, GameEventExtra, GameEventType, translations } from 'ftb-models';
import userState from '@src/tools/user.store';
import { CategoryInterface } from '@src/components/ftb-searchable-content/ftb-searchable-content.component';
import Goal from '../../assets/icons/goal.svg';

@Component({
  tag: 'ftb-game-events',
  styleUrl: 'ftb-game-events.component.scss',
  shadow: false,
})
export class FtbGameEvents {
  @Prop() game!: Game;

  componentWillLoad() {
    this.sortEvents();
  }

  private isMainEvent(event) {
    return [
      GameEventType.GAME_ENDED,
      GameEventType.GAME_STARTED,
      GameEventType.PART_ENDED,
      GameEventType.F_GOAL,
      GameEventType.V_ACE,
      GameEventType.V_POINT,
      GameEventType.B_SHOT_ONE,
      GameEventType.B_SHOT_TWO,
      GameEventType.B_SHOT_THREE,
    ].includes(event.type);
  }

  render() {
    if (!this.game.events.length) return;

    const filterFn = async (events: GameEvent[], query: string, categories: CategoryInterface[]) => {
      const importanceCat = categories.find(c => c.key === 'importance');
      if (importanceCat?.options.find(o => o.selected).key === 'important') {
        events = events.filter(this.isMainEvent);
      }
      return filter(events, query, [
        'firstPlayer.firstName',
        'firstPlayer.middleName',
        'firstPlayer.lastName',
        'secondPlayer.firstName',
        'secondPlayer.middleName',
        'secondPlayer.lastName',
      ]);
    };

    const renderContentFn = (events: GameEvent[]) => {
      const hasEventsWithMinute = events.some(e => e.minute);
      return (
        <div class="ftb-game-events__wrapper">
          <div class="ftb-game-events__background">{events.map(e => this.renderEvent(e, hasEventsWithMinute))}</div>
        </div>
      );
    };

    const categories = [];
    if (this.game.events.some(e => !this.isMainEvent(e))) {
      // add importance category
      categories.push({
        key: 'importance',
        placeholder: translations.search.search[userState.language],
        filterFn: (query: string, options: Array<{ key: string; text: string }>) => {
          const result = [];
          const matches = (tr: string) => tr.toLowerCase().includes(query.toLowerCase());
          if (matches(translations.game.events.all_events[userState.language])) {
            result.push(options[0]);
          }
          if (matches(translations.game.events.only_main_events[userState.language])) {
            result.push(options[1]);
          }
          return result;
        },
        renderItem: i => i.text,
        options: [
          { key: 'all', text: translations.game.events.all_events[userState.language] },
          { key: 'main', text: translations.game.events.only_main_events[userState.language] },
        ],
      });
    }

    return (
      <Host>
        <ftb-searchable-content
          items={this.game.events}
          renderItems={i => renderContentFn(i)}
          filterFn={filterFn}
          placeholder={translations.player.search_by_player_name[userState.language]}
          categories={categories}
        ></ftb-searchable-content>
      </Host>
    );
  }

  private renderEvent(e: GameEvent, renderMinute: boolean) {
    return (
      <div class="event">
        <div class="event-background">
          {renderMinute && (
            <div class="event-minute">
              <div class="event-minute-background">{e.minute ? e.minute + "'" : '-'}</div>
            </div>
          )}
          <div class="event-content">
            <div class="event-content-background">
              <div
                class={{
                  'top-line': true,
                  'home': e.team?._id === this.game.home.team._id,
                  'away': e.team?._id === this.game.home.team._id,
                }}
              >
                {this.renderEventText(e)}
                {this.renderEventPlayers(e)}
              </div>
            </div>
            {e.comment && (
              <div
                class={{
                  comment: true,
                  standalone: e.type === GameEventType.COMMENT,
                }}
              >
                {e.comment}
              </div>
            )}
          </div>
          {e.team && (
            <div class="event-team">
              <div class="event-team-background">
                <ftb-team-logo team={e.team}></ftb-team-logo>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  private renderEventText(e: GameEvent) {
    return (
      <span class="event-type">
        {e.type == GameEventType.V_POINT && <b>{translations.game.events.point[userState.language]}</b>}
        {e.type == GameEventType.V_ACE && <b>{translations.game.events.ace[userState.language]}</b>}
        {e.type == GameEventType.V_BLOCK && <b>{translations.game.events.block[userState.language]}</b>}
        {e.type == GameEventType.B_SHOT_ONE && <b class="b-point">1</b>}
        {e.type == GameEventType.B_SHOT_TWO && <b class="b-point">2</b>}
        {e.type == GameEventType.B_SHOT_THREE && <b class="b-point">3</b>}
        {e.type == GameEventType.B_MISSED_ONE && <b class="b-miss">1</b>}
        {e.type == GameEventType.B_MISSED_TWO && <b class="b-miss">2</b>}
        {e.type == GameEventType.B_MISSED_THREE && <b class="b-miss">3</b>}
        {e.type == GameEventType.B_STEAL && <b>{translations.game.events.steal[userState.language]}</b>}
        {e.type == GameEventType.B_LOSS && <b>{translations.game.events.loss[userState.language]}</b>}
        {e.type == GameEventType.B_FOUL && <b>{translations.game.events.foul[userState.language]}</b>}
        {e.type == GameEventType.F_GOAL && <ftb-icon svg={Goal}></ftb-icon>}
        {e.type == GameEventType.F_CORNER && <b>{translations.game.events.corner[userState.language]}</b>}
        {e.type == GameEventType.F_DANGER && <b>{translations.game.events.danger[userState.language]}</b>}
        {e.type == GameEventType.F_SHOT && <b>{translations.game.events.shot[userState.language]}</b>}
        {e.type == GameEventType.F_SHOT_MISSED && <b>{translations.game.events.shot_missed[userState.language]}</b>}
        {e.type == GameEventType.F_FOUL && <b>{translations.game.events.foul[userState.language]}</b>}
        {e.type == GameEventType.F_YELLOW && <i class="card yellow"></i>}
        {e.type == GameEventType.F_RED && <i class="card red"></i>}
        {e.type == GameEventType.F_SECOND_YELLOW && <i class="card yellow"></i>}
        {e.type == GameEventType.F_SECOND_YELLOW && <i class="card red"></i>}
        {e.type == GameEventType.GAME_STARTED && (
          <span>{translations.game.events.game_started[userState.language]}</span>
        )}
        {e.type == GameEventType.PART_ENDED && (
          <span>
            {this.game.league.sports == 'football' && translations.game.events.first_half_ended[userState.language]}
            {this.game.league.sports == 'beach-soccer' && translations.game.events.period_ended[userState.language]}
            {this.game.league.sports == 'basketball' && translations.game.events.quarter_ended[userState.language]}
            {this.game.league.sports == 'volleyball' && translations.game.events.set_ended[userState.language]}
          </span>
        )}
        {e.type == GameEventType.GAME_ENDED && <span>{translations.game.events.game_ended[userState.language]}</span>}
      </span>
    );
  }

  private renderEventPlayers(e: GameEvent) {
    return (
      <div class="event-players">
        {e.type == GameEventType.F_GOAL && !e.firstPlayer && (
          <span class="first-player-name name">{translations.game.events.unknown[userState.language]}</span>
        )}
        {e.firstPlayer && (
          <a class="first-player-name name">
            {e.firstPlayer._id > 0 && e.firstPlayer.firstName[0] + '.' + e.firstPlayer.lastName}
            {e.firstPlayer._id == -GameEventExtra.OWN_GOAL && translations.game.events.own_goal[userState.language]}
          </a>
        )}
        {e.secondPlayer && (
          <a class="second-player-name name">
            {e.secondPlayer._id > 0 && e.secondPlayer.firstName[0] + '.' + e.secondPlayer.lastName}
            {e.secondPlayer._id == -GameEventExtra.FREE_KICK &&
              translations.game.events.from_free_kick[userState.language]}
            {e.secondPlayer._id == -GameEventExtra.PENALTY && translations.game.events.from_penalty[userState.language]}
          </a>
        )}
      </div>
    );
  }

  private sortEvents() {
    this.game.events.sort((a, b) => {
      if (a.minute) a.minute = parseInt(a.minute + '');
      if (b.minute) b.minute = parseInt(b.minute + '');
      if (a.type == GameEventType.GAME_ENDED && b.type != GameEventType.COMMENT) return -1;
      if (b.type == GameEventType.GAME_ENDED && a.type != GameEventType.COMMENT) return 1;
      if (a.type == GameEventType.GAME_STARTED && b.type != GameEventType.COMMENT) return 1;
      if (b.type == GameEventType.GAME_STARTED && a.type != GameEventType.COMMENT) return -1;
      if (a.minute && !b.minute) return -1;
      if (b.minute && !a.minute) return 1;
      if (a.minute && b.minute && a.minute != b.minute) return b.minute - a.minute;
      return b._id - a._id;
    });
  }
}
