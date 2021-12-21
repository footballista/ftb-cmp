import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import { Post, envState, checkElementSize } from 'ftb-models';
import ArticleIcon from '../../assets/icons/article.svg';

@Component({
  tag: 'ftb-post-photo',
  styleUrl: 'ftb-post-photo.component.scss',
  shadow: false,
})
export class FtbPostCover {
  @Prop() post!: Post;
  /** If not defined, image resolution will be detected from on element size */
  @Prop({ mutable: true }) mode?: 'min' | 'middle' | 'max';

  /** Image loading failed (possibly photo does not exist on server), showing default placeholder */
  @State() showPlaceholder: boolean = false;

  @Element() el: HTMLFtbTeamLogoElement;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  async componentDidLoad() {
    if (!this.mode) {
      const { width } = checkElementSize(this.el);
      if (width > 200) {
        this.mode = 'max';
      } else if (width > 50) {
        this.mode = 'middle';
      } else {
        this.mode = 'middle';
      }
    }
  }

  render() {
    if (!this.post) return;

    const url = size =>
      envState.imgHost + 'img/news/' + this.post._id + '-' + size + '.jpg?version=' + this.post.photoId;

    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={ArticleIcon} title={this.post.title} class="placeholder-icon" />
        ) : (
          [
            <picture>
              <source srcSet={url('min')} />
              <img
                src={url('min')}
                alt={this.post.title}
                title={this.post.title}
                onError={e => this.onImgFail(e.target as HTMLImageElement)}
              />
            </picture>,
            this.mode == 'middle' ? (
              <picture>
                <source srcSet={url('middle')} />
                <img
                  src={url('middle')}
                  alt={this.post.title}
                  title={this.post.title}
                  onError={e => this.onImgFail(e.target as HTMLImageElement)}
                  loading="lazy"
                />
              </picture>
            ) : null,
            this.mode == 'max' ? (
              <picture>
                <source srcSet={url('max')} />
                <img
                  src={url('max')}
                  alt={this.post.title}
                  title={this.post.title}
                  onError={e => this.onImgFail(e.target as HTMLImageElement)}
                  loading="lazy"
                />
              </picture>
            ) : null,
          ]
        )}
      </Host>
    );
  }
}
