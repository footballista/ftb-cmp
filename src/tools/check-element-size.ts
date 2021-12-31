import { readTask } from '@stencil/core';

export const checkElementSize = (el: HTMLElement, iterationLimit = 10, iteration = 0) => {
  return new Promise(resolve => {
    if (iteration++ < iterationLimit) {
      return readTask(() => {
        const { offsetWidth, offsetHeight } = el;
        if (!offsetWidth && !offsetHeight) {
          return resolve(checkElementSize(el, iterationLimit, iteration));
        } else {
          return resolve({ width: offsetWidth, height: offsetHeight });
        }
      });
    } else {
      return resolve({ height: 0, width: 0 });
    }
  });
};
