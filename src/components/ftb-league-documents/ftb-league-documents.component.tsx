import { Component, Host, h, Prop } from '@stencil/core';
import { Document, filter, League, translations } from 'ftb-models';
import { GraphqlClient } from 'ftb-models/dist/tools/clients/graphql.client';
import { HttpClient } from 'ftb-models/dist/tools/clients/http.client';
import { User } from 'ftb-models/dist/models/user.model';
import { LeagueService } from 'ftb-models/dist/services/league.service';
import { AsyncSubject } from 'rxjs';
import userState from '@src/tools/user.store';
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
            rows={1}
            itemMinWidthPx={200}
            itemHeightPx={60}
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
        href={`http://localhost:3001/api/files/${doc.title}_${doc._id}.${doc.extension}`}
        download={doc.title}
        target="_blank"
      >
        <ftb-icon svg={iconsMap[doc.extension]}></ftb-icon>
        <div class="title">{doc.title}</div>
      </a>
    );
  }
}
