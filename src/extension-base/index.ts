import { LitElement } from 'lit';
import { state} from 'lit/decorators.js';
import { Task } from '@lit/task';

import { TWITCH_THEMES } from '../overlay/extension-overlay/types';

import { sourceLocale ,targetLocales } from '../generated/locale-codes';
import { setLocale } from '../utils/localization';
import { TwitchExtensionAuth } from '../types/twitch';

/**
 * Base class for all extension views.
 * 
 * Contains shared logic and functionality.
 */
export abstract class ExtensionBase extends LitElement {
    /**
     * Parsed URL search parameters from the `window` provided by the Extension loader.
     */
    static urlParameters = new URLSearchParams(window.location.search);

    /**
     * Used to detect if the extension is running on localhost
     */
    static isLocalhost = window.location.hostname === 'localhost';

    /**
     * Indicates if the extension is in light or dark theme
     * 
     * Is determined by the theme the viewer is using in Twitch
    */
    @state()
    protected theme = ExtensionBase.urlParameters.has('theme')
                        ? ExtensionBase.urlParameters.get('theme') as TWITCH_THEMES
                        : TWITCH_THEMES.LIGHT;

    /**
     * Async task to load the correct locale bundle before rendering anything
     */
    @state()
    protected loadLocaleTask = new Task(this, {
        task: ([language]) => setLocale(language),
        args: () => [this.language]
    });

    /**
     * Language value from the urlParameters.  If the provided language is a supported language by the extension, load its locale files.  Else load the source locale.
     */
    protected language = ExtensionBase.urlParameters.has('language')
                        && targetLocales.indexOf(ExtensionBase.urlParameters.get('language') as any) !== -1 
                        ? ExtensionBase.urlParameters.get('language') as string
                        : sourceLocale;

    /**
     * Auth object returned by window.Twitch.ext.onAuthorized that is used to authenticate Twitch API calls
    */
    protected auth!: TwitchExtensionAuth;

    /**
     * List of promises to resolve when the mock server is setup
     */
    protected onMockServerSetup:(() => Array<Promise<() => unknown>>) = () => [];

    /**
     * List of promises to resolve when the Twitch extension is authorized
     */
    protected onTwitchExtensionAuthorized:((auth:TwitchExtensionAuth) => Array<Promise<(auth:TwitchExtensionAuth) => unknown>>) = () => [];

    connectedCallback():void {
        super.connectedCallback();
        // Get the Twitch Auth info when we get it
        window.Twitch.ext.onAuthorized((auth:TwitchExtensionAuth) => {
            this.auth = auth;
            // Perform any actions that need to be done when the extension is authorized
            Promise.all(this.onTwitchExtensionAuthorized(auth));
        });
        // If locally testing, load and setup mock server
        if (ExtensionBase.isLocalhost) {
            this.setupMockDevServer();
        }
    }

    /**
     * Sets up the mock dev server for local testing
     * @returns `Promise` that resolves when the mock server is setup
     */
    private setupMockDevServer():Promise<unknown> {
        return import(
            /* webpackChunkName: "mock-server" */
            '../mockServer'
        ).then(({setupMockDevServer}) => {
            setupMockDevServer();
            return Promise.all(this.onMockServerSetup());
        });
    }
}