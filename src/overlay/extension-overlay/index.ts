import { html, LitElement, nothing, TemplateResult } from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import {styleMap} from 'lit-html/directives/style-map.js';
import {classMap} from 'lit-html/directives/class-map.js';
import {msg, str} from '@lit/localize';
import {Task} from '@lit/task';
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';

import {drag} from '../../utils/drag';
import {clamp} from '../../utils/clamp';

import { sourceLocale ,targetLocales } from '../../generated/locale-codes';
import { setLocale } from '../../utils/localization';

import { defaultFilterValues, filtersArray } from './filters';

import type { TwitchExtensionAuth, TwitchExtensionContext } from '../../types/twitch';

import style from './style.scss';

import { MIX_BLEND_MODE, EmoteMapItem, Filter, FILTER_FIELDS, FILTER_SIDE, FilterData, TWITCH_EMOTE_FORMATS, TWITCH_EMOTE_SCALE, TWITCH_THEMES, TwitchEmote } from './types';
import { SlCard, SlChangeEvent, SlInput, SlInputEvent, SlRadioGroup } from '@shoelace-style/shoelace';

/**
 * Main component for the application
 */
@customElement('extension-overlay')
export default class ExtensionOverlay extends LitElement {
    // ----------------------------- Static Values -----------------------------
    static styles = style;

    /**
     * Used for local development to show content for the left side
     */
    static isLocalhost = window.location.hostname === 'localhost';

    /**
     * Test stream channel to show in the overlay
     */
    static testStreamChannel = 'qa_partner_sirhype';

    /**
     * Parsed URL search parameters from the `window` provided by the Extension loader.
     */
    static urlParameters = new URLSearchParams(window.location.search);

    /**
     * List of emote sets to load into `this.emoteMap`
     * 
     * Emote sets are indicated by either a string code or `global` for the global emote set
     */
    static twitchEmoteSetsToLoad = [
        // Twitch Turbo Set
        '19194'
    ];

    /**
     * Emote to use for filter examples if it exists in `this.emoteMap`
     * 
     * `KappaHD` is from the Twitch Turbo emote set so this set must be loaded for us to use it
     */
    static filterExampleEmoteName = 'KappaHD';

    // ----------------------------- State Variables -----------------------------

    /**
     * Current position of the filter slider
     */
    @state()
    private dividerPosition = -10;

    /**
     * Marks if we are currently dragging the divider
     * Used so we can disable pointer events on the left and right side during this
     */
    @state()
    private isDragging = false;

    /**
     * Marks if the editor is currently on screen
     */
    @state()
    private editorActive = false;

    /**
     * Marks if the divider is currently on screen
     */
    @state()
    private dividerActive = false;

    /**
     * When divider is active, what side of the divider is the filter applied
     */
    @state()
    private filterSide: FILTER_SIDE = FILTER_SIDE.RIGHT;

    /**
     * X position of the toggle button
     */
    @state()
    private editorTogglePositionX = 100;

    /**
     * Y position of the toggle button
     */
    @state()
    private editorTogglePositionY = 0;

    /**
     * Indicates if we are currently dragging the editor toggle
     */
    @state()
    private isDraggingEditorToggle = false;

    // ----------------------------- Filter values -----------------------------

    /**
     * Blur value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur
     */
    @state()
    private filterBlur = defaultFilterValues[FILTER_FIELDS.BLUR];

    /**
     * Brightness value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/brightness
     */
    @state()
    private filterBrightness = defaultFilterValues[FILTER_FIELDS.BRIGHTNESS];

    /**
     * Contrast value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/contrast
     */
    @state()
    private filterContrast = defaultFilterValues[FILTER_FIELDS.CONTRAST];

    /**
     * Grayscale value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/grayscale
     */
    @state()
    private filterGrayscale = defaultFilterValues[FILTER_FIELDS.GRAYSCALE];

    /**
     * Hue rotate value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/hue-rotate
     */
    @state()
    private filterHueRotate = defaultFilterValues[FILTER_FIELDS.HUE_ROTATE];

    /**
     * Invert value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert
     */
    @state()
    private filterInvert = defaultFilterValues[FILTER_FIELDS.INVERT];

    /**
     * Saturate value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/saturate
     */
    @state()
    private filterSaturate = defaultFilterValues[FILTER_FIELDS.SATURATE];

    /**
     * Sepia value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/sepia
     */
    @state()
    private filterSepia = defaultFilterValues[FILTER_FIELDS.SEPIA];

    /**
     * Value for the background color for the currently applied filter.
     * 
     * Can be either an empty string or a valid rgba color
     */
    @state()
    private filterBackground = defaultFilterValues[FILTER_FIELDS.BACKGROUND];

    /**
     * Opacity of the tint color for the currently applied filter
     */
    @state()
    private filterOpacity = defaultFilterValues[FILTER_FIELDS.OPACITY];

    /**
     * Mix blend mode for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
     */
    @state()
    private filterMixBlendMode = defaultFilterValues[FILTER_FIELDS.MIX_BLEND_MODE];

    // ----------------------------- End Filter Values -----------------------------

    /**
     * Indicates if the extension is in light or dark theme
     * 
     * Is determined by the theme the viewer is using in Twitch
    */
    @state()
    private theme = ExtensionOverlay.urlParameters.has('theme')
                        ? ExtensionOverlay.urlParameters.get('theme') as TWITCH_THEMES
                        : TWITCH_THEMES.LIGHT;

    /**
     * Indicates if currently the divider is being added or removed via animation
     */
    @state()
    private isAnimatingDivider = false;

    /**
     * Current search term for the filter search
     */
    @state()
    private filterSearchTerm = '';

    /**
     * Map of emotes that can be used
     */
    @state()
    private emoteMap:Map<string, EmoteMapItem> = new Map();

    /**
     * Async task to load the correct locale bundle before rendering anything
     */
    @state()
    private loadLocaleTask = new Task(this, {
        task: ([language]) => setLocale(language),
        args: () => [this.language]
    });

    /**
     * Represents the base `<div>` element of the extension
     */
    @query('.base')
    private base!: HTMLDivElement;

    /**
     * Represents the `<div> where the editor toggle can be dragged in the DOM
     */
    @query('.editorHolderSafe')
    private editorToggleDragArea!: HTMLDivElement;

    /**
     * Represents the `sl-card` element contining the editor
     */
    @query('.editorCard')
    private editorCard!: SlCard;

    /**
     * Represents the `<form>` element with customization settings inside the editor
     */
    @query('.editorForm')
    private editorForm!: HTMLFormElement;

    /**
     * Language value from the urlParameters.  If the provided language is a supported language by the extension, load its locale files.  Else load the source locale.
     */
    private language = ExtensionOverlay.urlParameters.has('language')
                        && targetLocales.indexOf(ExtensionOverlay.urlParameters.get('language') as any) !== -1 
                        ? ExtensionOverlay.urlParameters.get('language') as string
                        : sourceLocale;

    /**
     * Auth object returned by window.Twitch.ext.onAuthorized that is used to authenticate Twitch API calls
    */
    private auth!: TwitchExtensionAuth;

    /**
     * Indicates if the user has overridden the theme using the theme toggle.
     * 
     * If so, we don't want to override it with what's coming from the `window.Twitch.ext.onAuthorized` event.
     */
    private hasOverriddenTheme = false;

    connectedCallback():void {
        super.connectedCallback();
        // Get the Twitch Auth info when we get it
        window.Twitch.ext.onAuthorized((auth:TwitchExtensionAuth) => {
            this.auth = auth;
            this.getEmotes();
        });
        // When the context changes, update the theme
        window.Twitch.ext.onContext((ctx:TwitchExtensionContext) => {
            if (!this.hasOverriddenTheme) {
                this.theme = ctx.theme as TWITCH_THEMES;
            }
        });
        // If locally testing, load and setup mock server and manually trigger emote calls
        if (ExtensionOverlay.isLocalhost) {
            import(
                /* webpackChunkName: "mock-server" */
                '../../mockServer'
            ).then(({setupMockDevServer}) => {
                setupMockDevServer();
                this.getEmotes();
            });
        }
    }

    // After a property has updated
    updated(changedProperties:Map<string, any>) {
        super.updated(changedProperties);
        // Set theme details in DOM when theme changes
        if (changedProperties.has("theme")) {
            this.applyTheme(this.theme);
        }
    }

    /**
     * Function to apply the theme class to the body of the DOM
     * @param targetTheme Theme to apply
     */
    applyTheme(targetTheme:string) {
        if (targetTheme === 'light') {
            document.body.classList.add("sl-theme-light");
            document.body.classList.remove("sl-theme-dark");
        } else {
            document.body.classList.add("sl-theme-dark");
            document.body.classList.remove("sl-theme-light");
        }
    }

    /**
     * Generic handler to do API calls to the Twitch API using the Helix token
     * @param url URL to perform the GET of
     * @returns JSON object of the response
     */
    private doTwitchApiGet(url:string):Promise<any> {
        return fetch(url, {
            headers: {
                Authorization: this.auth && this.auth.helixToken ? `Extension ${this.auth.helixToken}` : '',
                'client-id': this.auth && this.auth.clientId ? this.auth.clientId : '',
            }
        }).then(e => e.json());
    }

    /**
     * Get all the emote sets we care about
     * @returns Emote data
     */
    private getEmotes():Promise<any> {
        return Promise.all(ExtensionOverlay.twitchEmoteSetsToLoad.map(setId => {
            // Global emotes have a different endpoint
            if (setId === 'global') {
                return this.getGlobalEmotes();
            }
            return this.getEmoteSet(setId);
        }));
    }

    /**
     * Gets a set of emotes from twitch based on set id and add them to `this.emoteMap`
     * @param setId The `emote_set_id` for the emote set (see https://dev.twitch.tv/docs/api/reference/#get-emote-sets)
     * @returns Response object
     */
    private getEmoteSet(setId: string):Promise<any> {
        return this.getEmotesFromUrl(`https://api.twitch.tv/helix/chat/emotes/set?emote_set_id=${setId}`);
    }

    /**
     * Get the global set of Twitch emotes and add them to `this.emoteMap`
     */
    private getGlobalEmotes():Promise<any> {
        return this.getEmotesFromUrl('https://api.twitch.tv/helix/chat/emotes/global');
    }

    /**
     * Function to get emotes from a Twitch API endpoint and add them to `this.emoteMap`
     * @param url URL to make the API call on
     * @returns The response from the API call
     */
    private getEmotesFromUrl(url: string):Promise<any> {
        return this.doTwitchApiGet(url)
            .then((res) => {
                // If we got a response with data then add it to the emote map
                if (res && res.data && res.data.length) {
                    this.addEmotesToMap(res.data, res.template);
                    return res;
                }
            });
    }

    /**
     * Function to add emotes to the emote map
     * @param input Array of emotes to add
     * @param template Template of the emote HTML to use
     */
    addEmotesToMap(input:Array<TwitchEmote>, template:string):void {
        // Get what we need for each emote
        input.forEach((item) => {
            // Create our emote object
            this.emoteMap.set(item.name, {
                id: item.id,
                format: item.format as Array<TWITCH_EMOTE_FORMATS>,
                scale: item.scale as Array<TWITCH_EMOTE_SCALE>,
                theme_mode: item.theme_mode as Array<TWITCH_THEMES>,
                template
            });
        });
    }

     /**
     * Compute the URL for an emote
     * @param name Name of the emote to look up
     * @param theme Current extension theme
     * @returns HTML of the emote
     */
    private computeEmoteUrl(name:string, theme:string): string | boolean {
        if (!this.emoteMap.has(name)) return false;
        const emote = this.emoteMap.get(name) as EmoteMapItem;
        const { id, theme_mode, scale, format, template } = emote;
        // Get the best scale we have
        const selectedScale = scale[scale.length - 1];
        // Try to match the current theme
        const selectedTheme = theme_mode.indexOf(theme as TWITCH_THEMES) !== -1 ? theme : theme_mode[0];
        // Get whatever format is at the bottom (animated emotes will list the animation at the bottom)
        const selectedFormat = format[format.length - 1];
        // Substitute the values into the template
        return template
            .replace('{{id}}', id)
            .replace('{{format}}', selectedFormat)
            .replace('{{theme_mode}}', selectedTheme)
            .replace('{{scale}}', selectedScale);
    }

    /**
     * Action handler for when the divider is being dragged
     * @param event `PointerEvent` being performed by the mouse
     */
    private handleDrag(event: PointerEvent):void {
        this.isDragging = true;
        const { width } = this.base.getBoundingClientRect();
    
        event.preventDefault();
    
        drag(this.base, {
          onMove: x => {
            if (this.isDragging) {
                this.dividerPosition = parseFloat(clamp((x / width) * 100, 0, 100).toFixed(2));
            }
          },
          onStop: () => {
            this.isDragging = false;
          },
          onLeave: () => {
            this.isDragging = false;
            // If the mouse is moving too fast, then the divider can not make it to stage left or right when the mouse goes there.
            // Therefore the following logic will drag it to the correct position in these instances
            if (this.dividerPosition <= 5) {
                this.dividerPosition = 0;
            } else if (this.dividerPosition >= 95) {
                this.dividerPosition = 100;
            }
          },
          initialEvent: event
        });
    }

    /**
     * Action handler for when the editor toggle is being dragged
     * @param event `PointerEvent` being performed by the mouse
     */
    private handleEditorButtonDrag(event: PointerEvent):void {
        this.isDraggingEditorToggle = true;
        const { width, height } = this.editorToggleDragArea.getBoundingClientRect();
    
        event.preventDefault();

        // Save how much we drag to help determine if we should do a toggle when the event ends
        let deltaX = 0
        let deltaY = 0;

        drag(this.editorToggleDragArea, {
            onMove: (x, y) => {
              if (this.isDraggingEditorToggle) {
                  const potentialX = parseFloat(clamp((x / width) * 100, 0, 100).toFixed(2));
                  const potentialY = parseFloat(clamp((y / height) * 100, 0, 100).toFixed(2));
                  // Save the delta for use in `onStop`
                  deltaX += Math.abs(this.editorTogglePositionX - potentialX);
                  deltaY += Math.abs(this.editorTogglePositionY - potentialY);
                  this.editorTogglePositionX = potentialX;
                  this.editorTogglePositionY = potentialY;
              }
            },
            onStop: () => {
                this.isDraggingEditorToggle = false;
                // If we did not move the button, then do a toggle
                if (deltaX === 0 && deltaX === 0) {
                        this.editorActive = !this.editorActive;
                        // After hiding the editor, scroll it back to the default
                        const cardBody = this.editorCard?.shadowRoot?.querySelector('slot[part="body"]');
                        if (!this.editorActive && cardBody ) {
                            setTimeout(() => {
                                cardBody.scrollTop = 0;
                            }, 150);
                        }
                }
            },
            onLeave: () => {
                this.isDraggingEditorToggle = false;
            },
            initialEvent: event
          });
    }

    /**
     * Toggle divider and animate it entering and exiting
     */
    private toggleDivider():void {
        // Save new state because we need to perform animations first
        const newDividerState = !this.dividerActive;
        this.isAnimatingDivider = true;
        // If the divider is now active
        if (newDividerState) {
            this.dividerActive = newDividerState;
            setTimeout(() => {
                // Always move the divider to mid-screen when activated
                this.dividerPosition = 50;
                setTimeout(() => {
                    this.isAnimatingDivider = false;
                }, 500);
            }, 100);
        // Else if the divider if now inactive
        } else {
            setTimeout(() => {
                // Exit the divider so the filter takes up the whole screen
                this.dividerPosition = this.filterSide === FILTER_SIDE.LEFT
                    ? 110
                    : -10;
                setTimeout(() => {
                    this.isAnimatingDivider = false;
                    this.dividerActive = newDividerState;
                }, 500);
            }, 100);
        }
    }

    /**
     * Function to change what side of the divider has the filter
     * @param event Change event
     */
    private toggleFilterSide(event:SlChangeEvent):void {
        this.filterSide = (event.target as SlRadioGroup).value as FILTER_SIDE;
    }

    /**
     * Action handler to update filter data on form update
     */
    private updateFilterData():void {
        const formValues = serialize(this.editorForm) as Record<string, string>;
        this.filterBlur = parseFloat(formValues[FILTER_FIELDS.BLUR]) || defaultFilterValues[FILTER_FIELDS.BLUR];
        this.filterBrightness = parseFloat(formValues[FILTER_FIELDS.BRIGHTNESS]) || defaultFilterValues[FILTER_FIELDS.BRIGHTNESS];
        this.filterContrast = parseFloat(formValues[FILTER_FIELDS.CONTRAST]) || defaultFilterValues[FILTER_FIELDS.CONTRAST];
        this.filterGrayscale = parseFloat(formValues[FILTER_FIELDS.GRAYSCALE]) || defaultFilterValues[FILTER_FIELDS.GRAYSCALE];
        this.filterHueRotate = parseInt(formValues[FILTER_FIELDS.HUE_ROTATE]) || defaultFilterValues[FILTER_FIELDS.HUE_ROTATE];
        this.filterInvert = parseFloat(formValues[FILTER_FIELDS.INVERT]) || defaultFilterValues[FILTER_FIELDS.INVERT];
        this.filterSaturate = parseFloat(formValues[FILTER_FIELDS.SATURATE]) || defaultFilterValues[FILTER_FIELDS.SATURATE];
        this.filterSepia = parseFloat(formValues[FILTER_FIELDS.SEPIA]) || defaultFilterValues[FILTER_FIELDS.SEPIA];
        this.filterBackground = formValues[FILTER_FIELDS.BACKGROUND] || defaultFilterValues[FILTER_FIELDS.BACKGROUND];
        this.filterOpacity = parseFloat(formValues[FILTER_FIELDS.OPACITY]) || defaultFilterValues[FILTER_FIELDS.OPACITY];
        this.filterMixBlendMode = formValues[FILTER_FIELDS.MIX_BLEND_MODE] as MIX_BLEND_MODE || defaultFilterValues[FILTER_FIELDS.MIX_BLEND_MODE];
    }

    /**
     * Function to update the filter search term
     * @param event Input event
     */
    private updateFilterSearch(event:SlInputEvent):void {
        const value = (event.target as SlInput).value;
        this.filterSearchTerm = value;
    }

    /**
     * Function to apply a pre-defined filter from `FilterData`
     * @param filter Filter Data to apply
     */
    private applyFilter(filter:FilterData):void {
        this.filterBlur = filter[FILTER_FIELDS.BLUR];
        this.filterBrightness = filter[FILTER_FIELDS.BRIGHTNESS];
        this.filterContrast = filter[FILTER_FIELDS.CONTRAST];
        this.filterGrayscale = filter[FILTER_FIELDS.GRAYSCALE];
        this.filterHueRotate = filter[FILTER_FIELDS.HUE_ROTATE];
        this.filterInvert = filter[FILTER_FIELDS.INVERT];
        this.filterSaturate = filter[FILTER_FIELDS.SATURATE];
        this.filterSepia = filter[FILTER_FIELDS.SEPIA];
        this.filterBackground = filter[FILTER_FIELDS.BACKGROUND];
        this.filterOpacity = filter[FILTER_FIELDS.OPACITY];
        this.filterMixBlendMode = filter[FILTER_FIELDS.MIX_BLEND_MODE];
    }

    /**
     * Action handler for the theme toggle
     */
    private onThemeToggleClick():void {
        this.hasOverriddenTheme = true;
        this.theme = this.theme === TWITCH_THEMES.LIGHT ? TWITCH_THEMES.DARK : TWITCH_THEMES.LIGHT;
    }

    /**
     * Function to reset the filter by applying the default
     */
    private reset():void {
        this.applyFilter(defaultFilterValues);
        this.filterSearchTerm = '';
    }

    /**
     * Clears the background field
     */
    private clearBackground():void {
        this.filterBackground = '';
    }

    /**
     * Renders the editor
     * @returns Rendered template of the editor
     */
    private renderEditor():TemplateResult {
        const editorControlsClasses = {
            editorControls: true,
            editorControlsVisible: this.editorActive
        };

        const editorToggleClasses = {
            editorToggle: true,
            editorToggleDragging: this.isDraggingEditorToggle
        };

        const editorToggleStyles = {
            left: `calc(${this.editorTogglePositionX}% - 20px)`,
            top: `calc(${this.editorTogglePositionY}% - 20px)`
        };

        const editorStyles = {
            'transform-origin': `${this.editorTogglePositionX <= 50 ? 'left' : 'right'} ${this.editorTogglePositionY}%`,
            left: this.editorTogglePositionX <= 50
                ? `calc(${this.editorTogglePositionX}% + 2rem)`
                : `calc(${this.editorTogglePositionX}% - 36rem - 20px)`,
            ...(this.editorTogglePositionY <= 50 && {top: `0`}),
            ...(this.editorTogglePositionY > 50 && {bottom: `0`})
        };

        return html`
            <div class="editorHolder">
                <div class="editorHolderUnsafeY"></div>
                <div class="editorHolderSafeY">
                    <div class="editorHolderUnsafeX"></div>
                    <div class="editorHolderSafe">
                        <sl-button
                            class="${classMap(editorToggleClasses)}"
                            style="${styleMap(editorToggleStyles)}"
                            variant="default"
                            size="medium"
                            circle
                            @mousedown="${this.handleEditorButtonDrag}"
                            @touchstart="${this.handleEditorButtonDrag}">
                                <sl-icon library="system" name="filters" label="${msg('Settings')}"></sl-icon>
                        </sl-button>
                        <div class="${classMap(editorControlsClasses)}" style="${styleMap(editorStyles)}">
                            <sl-card class="editorCard">
                                <div slot="header">
                                    <sl-icon-button
                                        name="${this.theme === TWITCH_THEMES.LIGHT ? 'sun' : 'moon'}"
                                        library="system"
                                        label="${msg('Toggle Theme')}"
                                        @click="${this.onThemeToggleClick}"></sl-icon-button>
                                </div>
                                <sl-details summary="${msg('Filters')}" open>
                                    <sl-input
                                        .value="${this.filterSearchTerm}"
                                        placeholder="${msg('Search')}"
                                        size="small"
                                        pill
                                        clearable
                                        @sl-input="${this.updateFilterSearch}">
                                            <sl-icon name="search" library="system" slot="prefix"></sl-icon>
                                    </sl-input>
                                    <div class="editorFiltersHolder">
                                        ${filtersArray.map(filter => this.renderFilter(filter))}
                                    </div>
                                </sl-details>
                                <sl-details summary="${msg('Customize')}">
                                    <form class="editorForm">
                                        <sl-range
                                            label="${msg('Blur')}"
                                            name="${FILTER_FIELDS.BLUR}"
                                            min="0"
                                            max="10"
                                            step="1"
                                            value="${this.filterBlur}"
                                            @sl-input="${this.updateFilterData}"></sl-range>
                                        <sl-range
                                            label="${msg('Brightness')}"
                                            name="${FILTER_FIELDS.BRIGHTNESS}"
                                            min="0"
                                            max="3"
                                            step="0.01"
                                            value="${this.filterBrightness}"
                                            @sl-input="${this.updateFilterData}"></sl-range>
                                        <sl-range
                                            label="${msg('Contrast')}"
                                            name="${FILTER_FIELDS.CONTRAST}"
                                            min="0"
                                            max="3"
                                            step="0.01"
                                            value="${this.filterContrast}"
                                            @sl-input="${this.updateFilterData}"></sl-range>
                                        <sl-range
                                            label="${msg('Grayscale')}"
                                            name="${FILTER_FIELDS.GRAYSCALE}"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value="${this.filterGrayscale}"
                                            @sl-input="${this.updateFilterData}"></sl-range>
                                        <sl-range
                                            label="${msg('Hue Rotate')}"
                                            name="${FILTER_FIELDS.HUE_ROTATE}"
                                            min="-360"
                                            max="360"
                                            step="1"
                                            value="${this.filterHueRotate}"
                                            @sl-input="${this.updateFilterData}"></sl-range>
                                        <sl-range
                                            label="${msg('Invert')}"
                                            name="${FILTER_FIELDS.INVERT}"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value="${this.filterInvert}"
                                            @sl-input="${this.updateFilterData}"></sl-range>
                                        <sl-range
                                            label="${msg('Saturate')}"
                                            name="${FILTER_FIELDS.SATURATE}"
                                            min="0"
                                            max="3"
                                            step="0.01"
                                            value="${this.filterSaturate}"
                                            @sl-input="${this.updateFilterData}"></sl-range>
                                        <sl-range
                                            label="${msg('Sepia')}"
                                            name="${FILTER_FIELDS.SEPIA}"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value="${this.filterSepia}"
                                            @sl-input="${this.updateFilterData}"></sl-range>
                                        <div class="formRow">
                                            <label for="${FILTER_FIELDS.BACKGROUND}">${msg('Background')}</label>
                                            <sl-color-picker
                                                .value="${this.filterBackground}"
                                                size="small"
                                                format="rgb"
                                                name="${FILTER_FIELDS.BACKGROUND}"
                                                no-format-toggle
                                                label="${msg('Tint Selector')}"
                                                @sl-input="${this.updateFilterData}"></sl-color-picker>
                                        ${this.filterBackground != '' ? html`
                                            <sl-icon-button
                                                library="system"
                                                name="x-circle-fill"
                                                label="${msg('Clear Background')}"
                                                @click="${this.clearBackground}"}"><sl-icon-button>
                                        ` : nothing}
                                        </div>
                                        <sl-range
                                            label="${msg('Opacity')}"
                                            name="${FILTER_FIELDS.OPACITY}"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value="${this.filterOpacity}"
                                            @sl-input="${this.updateFilterData}">
                                        </sl-range>
                                        <sl-select
                                            name="${FILTER_FIELDS.MIX_BLEND_MODE}"
                                            value="${this.filterMixBlendMode}"
                                            label="${msg('Mix Blend Mode')}"
                                            @sl-input="${this.updateFilterData}">
                                                <sl-option value="${MIX_BLEND_MODE.NORMAL}">${msg('Normal')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.MULTIPLY}">${msg('Multiply')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.SCREEN}">${msg('Screen')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.OVERLAY}">${msg('Overlay')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.DARKEN}">${msg('Darken')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.LIGHTEN}">${msg('Lighten')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.COLOR_DODGE}">${msg('Color Dodge')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.COLOR_BURN}">${msg('Color Burn')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.HARD_LIGHT}">${msg('Hard Light')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.SOFT_LIGHT}">${msg('Soft Light')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.DIFFERENCE}">${msg('Difference')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.EXCLUSION}">${msg('Exclusion')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.HUE}">${msg('Hue')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.SATURATION}">${msg('Saturation')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.COLOR}">${msg('Color')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.LUMINOSITY}">${msg('Luminosity')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.PLUS_DARKER}">${msg('Plus Darker')}</sl-option>
                                                <sl-option value="${MIX_BLEND_MODE.PLUS_LIGHTER}">${msg('Plus Lighter')}</sl-option>
                                        </sl-select>
                                    </form>
                                </sl-details>
                                <div class="editorControlsFooter" slot="footer">
                                    <sl-switch
                                        .disabled="${this.isAnimatingDivider}"
                                        @sl-change="${this.toggleDivider}"
                                        >${msg('Filter Slider')}</sl-switch>
                                    <sl-radio-group
                                        size="small"
                                        name="Filter Side"
                                        .value="${this.filterSide}"
                                        @sl-change="${this.toggleFilterSide}">
                                            <sl-radio-button
                                                pill
                                                .disabled="${this.isAnimatingDivider || !this.dividerActive}"
                                                value="left">${msg('Filter Left')}</sl-radio-button>
                                            <sl-radio-button
                                                pill
                                                .disabled="${this.isAnimatingDivider || !this.dividerActive}"
                                                value="right">${msg('Filter Right')}</sl-radio-button>
                                    </sl-radio-group>
                                    <sl-button
                                        variant="default"
                                        @click="${this.reset}">${msg('Reset')}</sl-button>
                                </div>
                            </sl-card>
                        </div>
                    </div>
                    <div class="editorHolderUnsafeX"></div>
                </div>
                <div class="editorHolderUnsafeY"></div>
            </div>
        `;
    }

    /**
     * Renders the card for an individual filter to select
     * @param filter Metadata for the filter
     * @returns Rendered filter card
     */
    private renderFilter(filter:Filter):TemplateResult {
        // Attempt to get an emote URL to use
        const filterEmoteUrl = this.computeEmoteUrl(ExtensionOverlay.filterExampleEmoteName, this.theme);

        const filterClasses = {
            filterCard: true,
            filterCardShown: filter.name.toLowerCase().indexOf(this.filterSearchTerm.toLowerCase()) !== -1,
            filterCardSelected: this.filterBlur === filter.values[FILTER_FIELDS.BLUR]
                && this.filterBrightness === filter.values[FILTER_FIELDS.BRIGHTNESS]
                && this.filterContrast === filter.values[FILTER_FIELDS.CONTRAST]
                && this.filterGrayscale === filter.values[FILTER_FIELDS.GRAYSCALE]
                && this.filterHueRotate === filter.values[FILTER_FIELDS.HUE_ROTATE]
                && this.filterInvert === filter.values[FILTER_FIELDS.INVERT]
                && this.filterSaturate === filter.values[FILTER_FIELDS.SATURATE]
                && this.filterSepia === filter.values[FILTER_FIELDS.SEPIA]
                && this.filterBackground === filter.values[FILTER_FIELDS.BACKGROUND]
                && this.filterOpacity === filter.values[FILTER_FIELDS.OPACITY]
                && this.filterMixBlendMode === filter.values[FILTER_FIELDS.MIX_BLEND_MODE]
        };
        const filterStyle = {
            filter: `${FILTER_FIELDS.BLUR}(${filter.values[FILTER_FIELDS.BLUR]}px)
                     ${FILTER_FIELDS.BRIGHTNESS}(${filter.values[FILTER_FIELDS.BRIGHTNESS]})
                     ${FILTER_FIELDS.CONTRAST}(${filter.values[FILTER_FIELDS.CONTRAST]})
                     ${FILTER_FIELDS.GRAYSCALE}(${filter.values[FILTER_FIELDS.GRAYSCALE]})
                     ${FILTER_FIELDS.HUE_ROTATE}(${filter.values[FILTER_FIELDS.HUE_ROTATE]}deg)
                     ${FILTER_FIELDS.INVERT}(${filter.values[FILTER_FIELDS.INVERT]})
                     ${FILTER_FIELDS.SATURATE}(${filter.values[FILTER_FIELDS.SATURATE]})
                     ${FILTER_FIELDS.SEPIA}(${filter.values[FILTER_FIELDS.SEPIA]})`,
            '--filter-background': filter.values[FILTER_FIELDS.BACKGROUND] || 'transparent',
            '--filter-opacity': filter.values[FILTER_FIELDS.OPACITY],
            '--filter-mix-blend-mode': filter.values[FILTER_FIELDS.MIX_BLEND_MODE]
        };
        const applyFilterBound = this.applyFilter.bind(this, filter.values);
        return html`
            <sl-card class="${classMap(filterClasses)}" @click="${applyFilterBound}">
                ${html`
                    <div class="filterPreview" style="${styleMap(filterStyle)}">
                        ${filterEmoteUrl ? html`
                            <img
                                class="filterEmotePreview"
                                src="${filterEmoteUrl}"
                                alt="${msg(str`${ExtensionOverlay.filterExampleEmoteName} Twitch Emote With ${filter.name} Filter Applied`)}"
                            />
                        ` : html`
                            <div class="filterPreviewNoEmote" style="${styleMap(filterStyle)}"></div>
                        `}
                    </div>
                `}
                <div slot="footer">
                    ${filter.name}
                </div>
            </sl-card>
        `;
    }

    /**
     * Function to render the draggable divider
     * @returns Rendered template of the divider
     */
    private renderDivider():TemplateResult {
        const dividerClasses = {
            baseItem: true,
            divider: true,
            dividerAnimating: this.isAnimatingDivider
        };
        const dividerStyle = {
            left: `${this.dividerPosition}%`
        };
        const iconClasses = {
            leftSide: this.dividerPosition === 0,
            rightSide: this.dividerPosition === 100
        };
        return html`
            <div
                style="${styleMap(dividerStyle)}"
                class="${classMap(dividerClasses)}">
                    <div
                        class="dividerLine dividerLineTop"
                        @mousedown=${this.handleDrag}
                        @touchstart=${this.handleDrag}>
                    </div>
                    <div
                        class="dividerHandle"
                        @mousedown=${this.handleDrag}
                        @touchstart=${this.handleDrag}>
                        <sl-icon
                            class="${classMap(iconClasses)}"
                            library="system"
                            name="grip-vertical">
                        </sl-icon>
                    </div>
                    <div
                        class="dividerLine dividerLineBottom"
                        @mousedown=${this.handleDrag}
                        @touchstart=${this.handleDrag}>
                    </div>
            </div>
        `;
    }

    /**
     * Render a test iframe of a Twitch stream when locally testing
     * @returns Rendered template of the iframe
     */
    private renderTestStreamFrame():TemplateResult {
        const frameClasses = {
            baseItem: true,
            overlayFrame: true,
            blockActions: this.isDragging || this.isDraggingEditorToggle
        };
        return html`
            <iframe
                class="${classMap(frameClasses)}"
                src="https://player.twitch.tv/?channel=${ExtensionOverlay.testStreamChannel}&parent=${window.location.hostname}"
                height="100%"
                width="100%"
                autoplay="true"
                muted="true">
            </iframe>
        `;
    }
    
    render():TemplateResult {
        // Determine the divider clip by if the filter will be on the left or right
        const dividerClipPath = this.filterSide === FILTER_SIDE.LEFT
            ?  `polygon(0 0, ${this.dividerPosition}% 0, ${this.dividerPosition}% 100%, 0 100%)`
            : `polygon(${this.dividerPosition}% 0, 100% 0, 100% 100%, ${this.dividerPosition}% 100%)`;
        const baseClasses = {
            base: true,
            dark: this.theme === TWITCH_THEMES.DARK,
            light: this.theme === TWITCH_THEMES.LIGHT
        };
        const filterStyle = {
            'backdrop-filter': `${FILTER_FIELDS.BLUR}(${this.filterBlur}px)
                                ${FILTER_FIELDS.BRIGHTNESS}(${this.filterBrightness})
                                ${FILTER_FIELDS.CONTRAST}(${this.filterContrast})
                                ${FILTER_FIELDS.GRAYSCALE}(${this.filterGrayscale})
                                ${FILTER_FIELDS.HUE_ROTATE}(${this.filterHueRotate}deg)
                                ${FILTER_FIELDS.INVERT}(${this.filterInvert})
                                ${FILTER_FIELDS.SATURATE}(${this.filterSaturate})
                                ${FILTER_FIELDS.SEPIA}(${this.filterSepia})`,
            '--filter-background': this.filterBackground || 'transparent',
            '--filter-opacity': this.filterOpacity,
            '--filter-mix-blend-mode': this.filterMixBlendMode,
            // Only clip if divider is enabled, else apply filter to entire view
            ...(this.dividerActive && {'clip-path': dividerClipPath})
        };
        const filterClasses = {
            baseItem: true,
            filter: true,
            blockActions: this.isDragging || this.isDraggingEditorToggle,
            dividerAnimating: this.isAnimatingDivider
        };
        // Don't render the component until locales are loaded
        return html`
            ${this.loadLocaleTask.render({
                complete: () => html`
                    <div
                        class="${classMap(baseClasses)}">
                            ${this.renderEditor()}
                            ${this.dividerActive ? this.renderDivider() : nothing}
                            <div class="${classMap(filterClasses)}" style="${styleMap(filterStyle)}"></div>
                            ${ExtensionOverlay.isLocalhost ? this.renderTestStreamFrame() : nothing}
                    </div>
                `
            })}
        `;
    }
}