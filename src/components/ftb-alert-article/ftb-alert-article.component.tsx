import { Component, Host, h, Prop } from '@stencil/core';
import { Alert, Post, relativeDate, userState } from 'ftb-models';

@Component({
  tag: 'ftb-alert-article',
  styleUrl: 'ftb-alert-article.component.scss',
  shadow: false,
})
export class FtbAlertArticle {
  @Prop() alert!: Alert;

  render() {
    return (
      <Host>
        <div class="ftb-alert-article__wrapper">
          <div class="ftb-alert-article__background">
            <div class="title">{this.alert.title[userState.language]}</div>
            <div class="date">{relativeDate(this.alert.date)}</div>
            <div class="content">
              <ftb-post-cover post={new Post({ photoId: this.alert.photoId, _id: this.alert._id })}></ftb-post-cover>
              <div class="title">{this.alert.articleTitle}</div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
