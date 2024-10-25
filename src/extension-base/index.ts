import { LitElement } from 'lit';
import { state} from 'lit/decorators.js';
import { Task } from '@lit/task';

import { sourceLocale ,targetLocales } from '../generated/locale-codes';
import { loadShoelaceLocale, setLocale } from '../utils/localization';
import { TWITCH_THEMES, TwitchExtensionAuth, TwitchExtensionContext } from '../types/twitch';

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
        task: ([language]) => Promise.all([setLocale(language), loadShoelaceLocale(language)]),
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
     * Context object returned by window.Twitch.ext.onContext that contains information about the extension's context
     */
    protected context!: TwitchExtensionContext;

    /**
     * List of promises to resolve when the mock server is setup
     */
    protected onMockServerSetup:(() => Array<Promise<() => unknown>>) = () => [];

    /**
     * List of promises to resolve when the Twitch extension is authorized in addition to the default behavior (saving the auth object)
     * @returns List of promises to resolve when the Twitch auth is retrieved
     */
    protected onTwitchExtensionAuthorized:(auth:TwitchExtensionAuth) => Array<Promise<unknown>> = () => [];

    /**
     * List of promises to resolve when the Twitch extension context changes
     * @returns List of promises to resolve when the Twitch extension context changes
     */
    protected onTwitchExtensionContext:(context:TwitchExtensionContext) => Array<Promise<unknown>> = () => [];
    
    connectedCallback():void {
        super.connectedCallback();
        // Set the language in the DOM so Shoelace can use it
        document.documentElement.setAttribute('lang', this.language);
        // Get the Twitch Auth info when we get it
        window.Twitch.ext.onAuthorized((auth:TwitchExtensionAuth) => {
            this.auth = auth;
            // Perform any actions that need to be done when the extension is authorized
            Promise.all(this.onTwitchExtensionAuthorized(auth));
        });
        // When the context changes, update the theme
        window.Twitch.ext.onContext((ctx:TwitchExtensionContext) => {
            this.context = ctx;
            Promise.all(this.onTwitchExtensionContext(ctx));
        });
        // If locally testing, load and setup mock server
        if (ExtensionBase.isLocalhost) {
            this.setupMockDevServer();
        }
    }

    // After a property has updated
    updated(changedProperties:Map<string, any>):void {
        super.updated(changedProperties);
        // Set theme details in DOM when theme changes
        if (changedProperties.has("theme")) {
            this.applyTheme(this.theme);
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

    /**
     * Function to apply the theme class to the body of the DOM
     * @param targetTheme Theme to apply
     */
    protected applyTheme(targetTheme:string) {
        if (targetTheme === 'light') {
            document.body.classList.add("sl-theme-light");
            document.body.classList.remove("sl-theme-dark");
        } else {
            document.body.classList.add("sl-theme-dark");
            document.body.classList.remove("sl-theme-light");
        }
    }
}