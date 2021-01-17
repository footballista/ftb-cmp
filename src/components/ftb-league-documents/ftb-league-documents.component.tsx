import { Component, Host, h, Prop } from '@stencil/core';
import {
  Document,
  filter,
  League,
  translations,
  GraphqlClient,
  HttpClient,
  User,
  LeagueService,
  userState,
  envState,
} from 'ftb-models';
import { AsyncSubject } from 'rxjs';
import Doc from '../../assets/icons/doc.svg';
import Pdf from '../../assets/icons/pdf.svg';
import Xls from '../../assets/icons/xls.svg';

@Component({
  tag: 'ftb-league-documents',
  styleUrl: 'ftb-league-documents.component.scss',
  shadow: false,
})
export class FtbLeagueDocuments {
  @Prop() league!: League;
  @Prop() paginationConfig: {
    itemMinWidthPx: number;
    itemMinHeightPx: number;
    rows?: number;
    fixedContainerHeightPx?: number;
    stretchX?: boolean;
    stretchY?: boolean;
    XtoY?: number;
  };

  private ready$ = new AsyncSubject<boolean>();

  componentWillLoad() {
    //todo move somewhere
    const gql = new GraphqlClient(new HttpClient('AFL_RU', new User()), 'http://localhost:3004/graphql/');
    new LeagueService(gql).loadLeagueDocuments(this.league._id).then(l => {
      this.league.documents = l.documents;
      this.ready$.next(true);
      this.ready$.complete();
    });
  }

  render() {
    if (!this.league.documents.total) return null;

    return (
      <Host>
        <div class="ftb-league-documents__wrapper">
          <div class="ftb-league-documents__background">
            <h2 class="component-header">{translations.documents.documents[userState.language]}</h2>
            <div class="ftb-league-documents__content">{this.renderDocumentsList()}</div>
          </div>
        </div>
      </Host>
    );
  }

  private renderDocumentsList() {
    let filtersOn = false;
    const filterFn = async (_, query: string) => {
      await this.ready$.toPromise();
      filtersOn = Boolean(query);
      return filter(this.league.documents.items, query, ['name']);
    };

    return (
      <ftb-searchable-content
        items={this.league.documents.items}
        renderItems={items => (
          <ftb-pagination
            totalItems={filtersOn ? items.length : this.league.documents.total}
            items={items}
            renderItem={(d: Document) => this.renderDocument(d)}
            rows={this.paginationConfig.rows}
            fixedContainerHeightPx={this.paginationConfig.fixedContainerHeightPx}
            itemMinWidthPx={this.paginationConfig.itemMinWidthPx}
            itemMinHeightPx={this.paginationConfig.itemMinHeightPx}
            stretchX={this.paginationConfig.stretchX}
            stretchY={this.paginationConfig.stretchY}
            XtoY={this.paginationConfig.XtoY}
          ></ftb-pagination>
        )}
        filterFn={filterFn}
        placeholder={translations.documents.search_by_document_title[userState.language]}
        categories={[]}
      ></ftb-searchable-content>
    );
  }

  private renderDocument(doc: Document) {
    const iconsMap = { doc: Doc, docx: Doc, xls: Xls, xlsx: Xls, pdf: Pdf };

    return (
      <a
        class="document"
        href={`${envState.apiHost}/files/${doc.title}_${doc._id}.${doc.extension}`}
        download={doc.title}
        target="_blank"
      >
        <ftb-icon svg={iconsMap[doc.extension]}></ftb-icon>
        <div class="title">{doc.title}</div>
      </a>
    );
  }
}
