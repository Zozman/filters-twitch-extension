// Based on https://github.com/lit/lit/blob/main/packages/localize/examples/runtime-ts/src/localization.ts

import {configureLocalization} from '@lit/localize';
import {sourceLocale, targetLocales, allLocales} from '../generated/locale-codes';

/**
 * List of locales Shoelace supports; loaded at compile time by Webpack's `DefinePlugin`
 */
declare var SHOELACE_LOCALES: Array<string>;

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale: string) => import(
    /* webpackChunkName: "locale-[request]" */
    `../generated/locales/${locale}`
  ),
});

/**
 * Loads the shoelace localization file for the specified locale or 'en' if it is not a 
 * @param locale The locale to attempt to load
 * @returns Loading the needed locale file
 */
export const loadShoelaceLocale = (locale:string) => {
  // Only attempt to load the Shoelace locale file if we support the language and if Shoelace supports it
  const loadedLocale = allLocales.includes(locale as typeof allLocales[0]) && SHOELACE_LOCALES.includes(locale)
    ? locale : sourceLocale;
  return import(
    /* webpackChunkName: "shoelace-locale-[request]" */
    `@shoelace-style/shoelace/dist/translations/${loadedLocale}.js`
  );
}