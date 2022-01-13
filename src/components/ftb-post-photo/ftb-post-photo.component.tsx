import { Component, Host, h, Prop, State, Element, writeTask } from '@stencil/core';
import { Post, envState, checkElementSize } from 'ftb-models';

import ArticleIcon from '../../assets/icons/article.svg';

const MIDDLE_SIZE_THRESHOLD = 50;
const MAX_SIZE_THRESHOLD = 200;

@Component({
  tag: 'ftb-post-photo',
  styleUrl: 'ftb-post-photo.component.scss',
  shadow: false,
})
export class FtbPostCover {
  @Prop() post!: Post;
  /** If not defined, image resolution will be detected from on element size */
  @Prop() mode?: 'min' | 'middle' | 'max';

  /** Image loading failed (possibly photo does not exist on server), showing default placeholder */
  @State() showPlaceholder: boolean = false;

  @Element() el: HTMLFtbTeamLogoElement;

  onImgFail(el: HTMLImageElement) {
    el.style.display = 'none';
    this.showPlaceholder = true;
  }

  async connectedCallback() {
    if (!this.post) return;
    const appendImg = (size: 'middle' | 'max') => {
      const pic = document.createElement('picture');
      const source = document.createElement('source');
      const img = document.createElement('img');
      pic.append(source, img);
      source.srcset = size == 'middle' ? this.url('middle') : this.url('max');
      img.src = size == 'middle' ? this.url('middle') : this.url('max');
      img.onload = () => writeTask(() => this.el.append(pic));
    };

    if (this.mode == 'middle') {
      appendImg('middle');
    } else if (this.mode == 'max') {
      appendImg('max');
    } else if (!this.mode) {
      checkElementSize(this.el).then(({ width }) => {
        if (width > MAX_SIZE_THRESHOLD) {
          appendImg('max');
        } else if (width > MIDDLE_SIZE_THRESHOLD) {
          appendImg('middle');
        }
      });
    }
  }

  url(_: 'min' | 'middle' | 'max') {
    return envState.imgHost + 'img/news/' + this.post._id + '.jpg?version=' + this.post.photoId;
    // todo enable multisize on server
    // return envState.imgHost + 'img/news/' + this.post._id + '-' + size + '.jpg?version=' + this.post.photoId;
  }

  render() {
    if (!this.post) return;

    return (
      <Host>
        {this.showPlaceholder ? (
          <ftb-icon svg={ArticleIcon} title={this.post.title} class="placeholder-icon" />
        ) : (
          <picture>
            <source srcSet={this.url('min')} />
            <img
              src={this.url('min')}
              alt={this.post.title}
              title={this.post.title}
              onError={e => this.onImgFail(e.target as HTMLImageElement)}
            />
          </picture>
        )}
      </Host>
    );
  }
}
