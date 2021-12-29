import { Component, h, Prop } from '@stencil/core';
import hljs from 'highlight.js';

@Component({
  tag: 'ftb-code-snippet',
  styleUrl: 'ftb-code-snippet.component.scss',
  shadow: false,
})
export class FtbCodeSnippet {
  @Prop() code: string;
  @Prop() language: string = 'html';

  render() {
    const result = hljs.highlight(this.code, { language: this.language });

    return (
      <pre>
        <code class={`hljs language-${this.language}`} ref={el => (el.innerHTML = result.value)} />
      </pre>
    );
  }
}
