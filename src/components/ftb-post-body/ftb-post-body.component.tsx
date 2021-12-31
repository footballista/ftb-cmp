import { Component, Host, h, Prop } from '@stencil/core';
import { Post, routingState } from 'ftb-models';
@Component({
  tag: 'ftb-post-body',
  styleUrl: 'ftb-post-body.component.scss',
  shadow: false,
})
export class FtbPostBody {
  @Prop() post!: Post;

  render() {
    if (!this.post) return null;

    return (
      <Host>
        <div class="ftb-post-body__wrapper">
          <div class="ftb-post-body__background">
            {this.post.tokens.map(token => {
              if (token.type == 'space') return this.renderPostSpace();
              if (token.type == 'paragraph') return this.renderPostParagraph(token);
              if (token.type == 'heading') return this.renderPostHeading(token);
              if (token.type == 'list') return this.renderPostList(token);
              if (token.type == 'blockquote') return this.renderPostBlockquote(token);
            })}
          </div>
        </div>
      </Host>
    );
  }

  renderPostParagraph(token) {
    return (
      <p>
        {token.tokens.map(tok => {
          if (tok.type == 'strong') return this.renderPostStrong(tok);
          if (tok.type == 'em') return this.renderPostEm(tok);
          if (tok.type == 'text') return this.renderPostText(tok);
          if (tok.type == 'link') return this.renderPostLink(tok);
          if (tok.type == 'image') return this.renderPostImage(tok);
          if (tok.type == 'codespan') return this.renderPostCodespan(tok);
        })}
      </p>
    );
  }

  renderPostStrong(token) {
    return (
      <strong>
        {token.tokens.map(tok => {
          if (tok.type == 'text') return this.renderPostText(tok);
          if (tok.type == 'em') return this.renderPostEm(tok);
          if (tok.type == 'link') return this.renderPostLink(tok);
        })}
      </strong>
    );
  }

  renderPostEm(token) {
    return (
      <em>
        {token.tokens.map(tok => {
          if (tok.type == 'text') return this.renderPostText(tok);
          if (tok.type == 'strong') return this.renderPostStrong(tok);
          if (tok.type == 'link') return this.renderPostLink(tok);
        })}
      </em>
    );
  }

  renderPostCodespan(token) {
    return <code>{token.text}</code>;
  }
  renderPostLink(token) {
    if (!token.href.includes('tag')) {
      return (
        <a href={token.href}>
          {token.tokens.map(tok => {
            if (tok.type == 'text') return this.renderPostText(tok);
            if (tok.type == 'strong') return this.renderPostStrong(tok);
            if (tok.type == 'em') return this.renderPostEm(tok);
          })}
        </a>
      );
    } else {
      const { route, params } = this.getEntityHref(token);
      return (
        <ftb-link route={route} params={params}>
          {token.tokens.map(tok => {
            if (tok.type == 'text') return this.renderPostText(tok);
            if (tok.type == 'strong') return this.renderPostStrong(tok);
            if (tok.type == 'em') return this.renderPostEm(tok);
          })}
        </ftb-link>
      );
    }
  }
  renderPostImage(token) {
    return <img src={token.href} alt={token.text} />;
  }

  renderPostText(token) {
    return token.text;
  }

  renderPostSpace() {
    return <br />;
  }
  renderPostHeading(token) {
    if (token.depth >= 1 && token.depth <= 6) {
      const HeaderTag = 'h' + token.depth;
      return (
        <HeaderTag>
          {token.tokens.map(tok => {
            if (tok.type == 'text') return this.renderPostText(tok);
          })}
        </HeaderTag>
      );
    }
  }
  renderPostList(token) {
    if (token.ordered) {
      return (
        <ol start={token.start}>
          {token.items.map(item => {
            return (
              <li>
                {item.tokens.map(tok => {
                  if (tok.type == 'text') return this.renderPostText(tok);
                })}
              </li>
            );
          })}
        </ol>
      );
    } else {
      return (
        <ul>
          {token.items.map(item => {
            return (
              <li>
                {item.tokens.map(tok => {
                  if (tok.type == 'text') return this.renderPostText(tok);
                })}
              </li>
            );
          })}
        </ul>
      );
    }
  }
  renderPostBlockquote(token) {
    return (
      <blockquote>
        {token.tokens.map(tok => {
          if (tok.type == 'paragraph') return this.renderPostParagraph(tok);
        })}
      </blockquote>
    );
  }

  private getEntityHref(token) {
    const parts = token.href.split('/');
    const entityName = parts[1];
    if (entityName === 'team') {
      return {
        route: routingState.routes.team,
        params: {
          teamId: parts[2],
          teamName: parts[3].replace(new RegExp('~', 'g'), ' '),
        },
      };
    } else if (entityName === 'stadium') {
      return {
        route: routingState.routes.stadium,
        params: {
          stadiumId: parts[2],
          stadiumName: parts[3].replace(new RegExp('~', 'g'), ' '),
        },
      };
    } else if (entityName === 'champ') {
      return {
        route: routingState.routes.season,
        params: {
          seasonId: parts[6],
          seasonTitle:
            parts[3].replace(new RegExp('~', 'g'), ' ') + ' - ' + parts[7].replace(new RegExp('~', 'g'), ' '),
        },
      };
    } else if (entityName === 'player') {
      return {
        route: routingState.routes.player,
        params: {
          playerId: parts[2],
          playerName: parts[3].replace(new RegExp('~', 'g'), ' '),
        },
      };
    } else if (entityName === 'person') {
      return {
        route: routingState.routes.person,
        params: {
          personId: parts[2],
          personName: parts[3].replace(new RegExp('~', 'g'), ' '),
        },
      };
    } else if (entityName === 'league') {
      return {
        route: routingState.routes.league,
        params: {
          personId: parts[2],
          personName: parts[3].replace(new RegExp('~', 'g'), ' '),
        },
      };
    }
  }
}
