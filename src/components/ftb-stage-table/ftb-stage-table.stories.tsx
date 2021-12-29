import { Component, h, Host, State } from '@stencil/core';
import { SeasonService, Stage } from 'ftb-models';
import range from 'lodash-es/range';

@Component({
  tag: 'ftb-stage-table-stories',
  styleUrl: 'ftb-stage-table.stories.scss',
  shadow: false,
})
export class FtbStageTableStories {
  @State() stage: Stage;

  componentWillLoad() {
    new SeasonService().loadSeasonStandings(3782).then(season => {
      this.stage = season.stages[0];
      this.stage.season = season;
    });
  }

  render() {
    return (
      <Host>
        <h1>Stage table</h1>
        <p>Renders tournament standings</p>
        <ftb-code-snippet code={'<ftb-stage-table stage={stage} />'} />
        {this.stage ? (
          <ftb-stage-table stage={this.stage} customWidths={{ position: 40, form: 110 }} />
        ) : (
          this.renderTableSkeleton()
        )}

        <h2>Partial table</h2>
        <p>
          You can programmatically set team to highlight on the table and render only <code>N</code> rows around it's
          position
        </p>
        <ftb-code-snippet
          code={"<ftb-stage-table stage={stage} rowsLimit={{baseTeam: {_id: 123, name: 'Arsenal'}, limit: 5}} />"}
        />
        {this.stage ? (
          <ftb-stage-table
            stage={this.stage}
            customWidths={{ position: 40, form: 110 }}
            rowsLimit={{ baseTeam: this.stage.table[5].team, limit: 5 }}
          />
        ) : (
          this.renderTableSkeleton()
        )}

        <h2>Adaptive content</h2>
        <p>Displayed content depends on container width. </p>
        {this.stage ? (
          <ftb-stage-table
            stage={this.stage}
            customWidths={{ position: 40, form: 110 }}
            class="narrow"
            rowsLimit={{ baseTeam: this.stage.table[5].team, limit: 5 }}
          />
        ) : (
          this.renderTableSkeleton()
        )}

        <h2>Chess</h2>
        <p>Big sized table can load and display all stage games</p>
        <div class="chess-table-wrapper">
          {this.stage ? (
            <ftb-stage-table
              stage={this.stage}
              customWidths={{ position: 40, form: 110, chess: 55 }}
              showChess={true}
              class="wide"
            />
          ) : (
            this.renderTableSkeleton()
          )}
        </div>
      </Host>
    );
  }

  renderTableSkeleton() {
    return (
      <div class="table-skeleton">
        {range(12).map(() => (
          <div class="row-skeleton" />
        ))}
      </div>
    );
  }
}
