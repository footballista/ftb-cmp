#!/usr/bin/env node
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const git = require('simple-git/promise')(__dirname + '/../');
const prettier = require('prettier');

/** trivial helper to generate files for components */
const fileName = process.argv[2];
const modelName = fileName
  .split('-')
  .map((p) => p[0].toUpperCase() + p.toLowerCase().slice(1))
  .join('');
const dirName = __dirname + '/../src/components/' + fileName + '/'
const componentFilePath =  dirName + fileName +'.component.tsx';
const styleFilePath = dirName + fileName +'.component.scss';

if (existsSync(componentFilePath) || existsSync(styleFilePath)) {
  throw new Error('File already exists');
}

const componentTmp = `
import { Component, Host, h } from '@stencil/core';
@Component({
  tag: '${fileName}',
  styleUrl: '${fileName}.component.scss',
  shadow: true,
})
export class ${modelName} {

  render() {
    return <Host></Host>
  }
}
`;

const lcFirst = (s) => s[0].toLowerCase() + s.slice(1);
const styleTmp = `:host {
}`;

(async () => {
  const prettierOptions = await prettier.resolveConfig(__dirname + '/../.prettierrc');
  const format = (contents) => prettier.format(contents, { ...prettierOptions, parser: 'typescript' });

  mkdirSync(dirName);

  writeFileSync(componentFilePath, format(componentTmp));
  git.add(componentFilePath);

  writeFileSync(styleFilePath, styleTmp)
  git.add(styleFilePath);
})();
