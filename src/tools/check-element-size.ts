export const checkElementSize = (el: HTMLElement, iterationLimit = 10, iteration = 0) => {
  const { offsetWidth, offsetHeight } = el;
  if (!offsetWidth && !offsetHeight) {
    if (iteration++ < iterationLimit) {
      return requestAnimationFrame(checkElementSize(el, iterationLimit, iteration));
    } else {
      return { width: 0, height: 0 };
    }
  } else {
    return { width: offsetWidth, height: offsetHeight };
  }
};
