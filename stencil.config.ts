import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { inlineSvg } from 'stencil-inline-svg';

export const config: Config = {
  namespace: 'ftb-cmp',
  plugins: [sass(), inlineSvg()],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'www',
      baseUrl: 'https://ftb-cmp.ru',
      serviceWorker: null,
    },
  ],
};
