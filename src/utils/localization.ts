// Based on https://github.com/lit/lit/blob/main/packages/localize/examples/runtime-ts/src/localization.ts

import {configureLocalization} from '@lit/localize';
import {sourceLocale, targetLocales} from '../generated/locale-codes';

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale: string) => import(`../generated/locales/${locale}`),
});
