import { Language } from 'ftb-models/dist/models/base/language';
import userState from '@src/tools/user-store';

export function getComponentLanguage(element: Element): Language {
  if (userState.user.language) {
    return userState.user.language;
  } else {
    const closestElement = element.closest('[lang]') as HTMLElement;
    return closestElement ? Language[closestElement.lang] : Language.default;
  }
}
