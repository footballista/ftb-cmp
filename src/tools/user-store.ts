import { createStore } from '@stencil/store';
import { User } from 'ftb-models/dist/models/user.model';
import { Language } from 'ftb-models/dist/models/base/language';
import { setToStorage } from '@src/tools/storage';

const { state, onChange } = createStore(new User({ language: Language.default }));

onChange('language', v => setToStorage('language', v));

export default state;
