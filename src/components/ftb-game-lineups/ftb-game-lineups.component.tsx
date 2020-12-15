import { Component, Host, h, Prop } from '@stencil/core';
import Goal from '../../assets/icons/goal.svg';
import Assist from '../../assets/icons/assist.svg';
import { Game, GameEventType, GameSide, translations } from 'ftb-models';
import groupBy from 'lodash-es/groupBy';
import findKey from 'lodash-es/findKey';
import { Player } from 'ftb-models/dist/models/player.model';
import { positionCategories } from 'ftb-models/dist/tools/players-positions';
import userState from '@src/tools/user.store';

@Component({
  tag: 'ftb-game-lineups',
  styleUrl: 'ftb-game-lineups.component.scss',
  shadow: false,
})
export class FtbGameLineups {
  @Prop() game!: Game;

  render() {
    return (
      <Host>
        <div class="ftb-game-lineups__wrapper">
          <div class="ftb-game-lineups__background">
            {this.renderSide(this.game.home)}
            {this.renderSide(this.game.away)}
          </div>
        </div>
      </Host>
    );
  }

  private renderSide(side: GameSide) {
    const players = groupBy(side.players, p => findKey(positionCategories, o => o.includes(p.position)));
    return (
      <div class="ftb-game-lineups__side">
        {side.players.length === 0 ? (
          <div class="lineup-not-set">{translations.game.lineup.lineup_not_set}</div>
        ) : (
          Object.keys(positionCategories).map(category => {
            if (!players[category]) return null;
            return (
              <div class="category">
                <div class="category-title">
                  {translations.position[this.game.league.sports][category][userState.language]}
                </div>
                {players[category].map(p => (
                  <div class="player">
                    <div class="player-wrapper">
                      <div class="player-background">
                        <div class="position">{p.position}</div>
                        <div class="name">
                          {p.firstName[0]}. {p.lastName}
                        </div>
                        {this.renderStats(p)}
                        <div class="number">#{p.number}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    );
  }

  private renderStats(p: Player) {
    const stats = this.game.events.reduce(
      (stats, event) => {
        if (event.firstPlayer && event.firstPlayer._id == p._id) {
          if (event.type == GameEventType.F_GOAL) {
            stats.goals++;
          } else if (event.type == GameEventType.F_YELLOW) {
            stats.yellow++;
          } else if (event.type == GameEventType.F_SECOND_YELLOW) {
            stats.yellow++;
            stats.red++;
          } else if (event.type == GameEventType.F_RED) {
            stats.red++;
          }
        } else if (event.secondPlayer && event.secondPlayer._id == p._id) {
          stats.assists++;
        }
        return stats;
      },
      { goals: 0, assists: 0, yellow: 0, red: 0 },
    );

    return (
      <div class="stats-wrapper">
        {stats.yellow ? (
          <div class="item">
            <i class="yellow"></i>
          </div>
        ) : null}
        {stats.red ? (
          <div class="item">
            <i class="red"></i>
          </div>
        ) : null}
        {stats.assists ? (
          <div class="item">
            <ftb-icon class="assist" svg={Assist}></ftb-icon>
            {stats.assists > 1 && (
              <span class="multi">
                <small>X</small>
                <span class="value">{stats.assists}</span>
              </span>
            )}
          </div>
        ) : null}
        {stats.goals ? (
          <div class="item">
            <ftb-icon class="assist" svg={Goal}></ftb-icon>
            {stats.goals > 1 && (
              <span class="multi">
                <small>X</small>
                <span class="value">{stats.goals}</span>
              </span>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}
