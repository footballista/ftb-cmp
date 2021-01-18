import { Component, h, Host, Prop } from '@stencil/core';
import { Season, Stage, StageFormat } from 'ftb-models';

@Component({
  tag: 'ftb-season-standings',
  styleUrl: 'ftb-season-standings.component.scss',
  shadow: false,
})
export class FtbSeasonStandings {
  @Prop() season!: Season;
  @Prop() splitToTabs: boolean;

  render() {
    if (!this.season.stages.filter(s => s.format !== StageFormat.free).length) return;

    this.season.stages.forEach(s => (s.season = this.season));

    const stages = this.season.stages.filter(s => s.format !== StageFormat.free);

    return (
      <Host>
        <div class="ftb-season-standings__wrapper">
          <div class="ftb-season-standings__background">
            {this.splitToTabs ? (
              <ftb-tabs
                tabs={stages.map(s => ({
                  renderTitle: () => this.renderStageTitle(s),
                  renderContent: () => this.renderStage(s),
                }))}
              ></ftb-tabs>
            ) : (
              stages.map(stage => {
                return [this.season.stages.length > 1 ? this.renderStageTitle(stage) : null, this.renderStage(stage)];
              })
            )}
          </div>
        </div>
      </Host>
    );
  }

  private renderStageTitle(stage: Stage) {
    return <h4 class="ftb-season-standings__stage-name">{stage.name}</h4>;
  }

  private renderStage(stage: Stage) {
    if (stage.format === StageFormat.league) {
      return <ftb-stage-table stage={stage}></ftb-stage-table>;
    } else {
      return <ftb-stage-cup-net stage={stage}></ftb-stage-cup-net>;
    }
  }
}
