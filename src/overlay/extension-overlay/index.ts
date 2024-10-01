import { html, LitElement, nothing, TemplateResult } from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import {styleMap} from 'lit-html/directives/style-map.js';
import {classMap} from 'lit-html/directives/class-map.js';
import {msg, str} from '@lit/localize';
import {Task} from '@lit/task';

import {drag} from '../../utils/drag';
import {clamp} from '../../utils/clamp';

import { sourceLocale ,targetLocales } from '../../generated/locale-codes';
import { setLocale } from '../../utils/localization';

import { setupMockDevServer } from '../../mockServer';

import { defaultFilterValues, filtersArray } from './filters';

import type { TwitchExtensionAuth, TwitchExtensionContext } from '../../types/twitch';

import style from './style.scss';

import { EmoteMapItem, Filter, FILTER_FIELDS, FILTER_SIDE, FilterData, TWITCH_EMOTE_FORMATS, TWITCH_EMOTE_SCALE, TWITCH_THEMES, TwitchEmote } from './types';
import { SlButton, SlChangeEvent, SlInput, SlInputEvent, SlRadioGroup, SlRange } from '@shoelace-style/shoelace';

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
    private filterBlur = defaultFilterValues.blur;

    /**
     * Brightness value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/brightness
     */
    @state()
    private filterBrightness = defaultFilterValues.brightness;

    /**
     * Contrast value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/contrast
     */
    @state()
    private filterContrast = defaultFilterValues.contrast;

    /**
     * Grayscale value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/grayscale
     */
    @state()
    private filterGrayscale = defaultFilterValues.grayscale;

    /**
     * Hue rotate value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/hue-rotate
     */
    @state()
    private filterHueRotate = defaultFilterValues.hueRotate;

    /**
     * Invert value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert
     */
    @state()
    private filterInvert = defaultFilterValues.invert;

    /**
     * Saturate value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/saturate
     */
    @state()
    private filterSaturate = defaultFilterValues.saturate;

    /**
     * Sepia value for the currently applied filter
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/sepia
     */
    @state()
    private filterSepia = defaultFilterValues.sepia;

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
     * Parsed URL search parameters from the `window` provided by the Extension loader.
     */
    private urlParameters = new URLSearchParams(window.location.search);

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

    connectedCallback():void {
        super.connectedCallback();
        // Get the Twitch Auth info when we get it
        window.Twitch.ext.onAuthorized((auth:TwitchExtensionAuth) => {
            this.auth = auth;
            this.getEmotes();
        });
        // When the context changes, update the theme
        window.Twitch.ext.onContext((ctx:TwitchExtensionContext) => {
            this.theme = ctx.theme as TWITCH_THEMES;
        });
        // If locally testing, setup mock server and manually trigger emote calls
        if (ExtensionOverlay.isLocalhost) {
            setupMockDevServer();
            this.getEmotes();
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
     * Function to update a value attached to a range input
     * @param field `FILTER_FILED` being updated
     * @param event Input event
     */
    private updateRangeValue(field:string, event:SlInputEvent):void {
        const value = (event.target as SlRange).value;
        if (field === FILTER_FIELDS.BLUR) {
            this.filterBlur = value;
        }
        if (field === FILTER_FIELDS.BRIGHTNESS) {
            this.filterBrightness = value;
        }
        if (field === FILTER_FIELDS.CONTRAST) {
            this.filterContrast = value;
        }
        if (field === FILTER_FIELDS.GRAYSCALE) {
            this.filterGrayscale = value;
        }
        if (field === FILTER_FIELDS.HUE_ROTATE) {
            this.filterHueRotate = value;
        }
        if (field === FILTER_FIELDS.INVERT) {
            this.filterInvert = value;
        }
        if (field === FILTER_FIELDS.SATURATE) {
            this.filterSaturate = value;
        }
        if (field === FILTER_FIELDS.SEPIA) {
            this.filterSepia = value;
        }
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
        this.filterBlur = filter.blur;
        this.filterBrightness = filter.brightness;
        this.filterContrast = filter.contrast;
        this.filterGrayscale = filter.grayscale;
        this.filterHueRotate = filter.hueRotate;
        this.filterInvert = filter.invert;
        this.filterSaturate = filter.saturate;
        this.filterSepia = filter.sepia;
    }

    private onThemeToggleClick():void {
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
            '--editorPercentageAdjustment': this.editorTogglePositionY <= 50
                ? `${this.editorTogglePositionY / 100}`
                : `${(100 - this.editorTogglePositionY) / 100}`,
            'transform-origin': `${this.editorTogglePositionX <= 50 ? 'left' : 'right'} ${this.editorTogglePositionY <= 50 ? 'top' : 'bottom'}`,
            left: this.editorTogglePositionX <= 50
                ? `calc(${this.editorTogglePositionX}% + 2rem)`
                : `calc(${this.editorTogglePositionX}% - 36rem - 20px)`,
            ...(this.editorTogglePositionY <= 50 && {top: `calc(${this.editorTogglePositionY}%)`}),
            ...(this.editorTogglePositionY > 50 && {bottom: `calc(100% - ${this.editorTogglePositionY}%)`})
        };

        const blurChange = this.updateRangeValue.bind(this, FILTER_FIELDS.BLUR);
        const brightnessChange = this.updateRangeValue.bind(this, FILTER_FIELDS.BRIGHTNESS);
        const contrastChange = this.updateRangeValue.bind(this, FILTER_FIELDS.CONTRAST);
        const grayscaleChange = this.updateRangeValue.bind(this, FILTER_FIELDS.GRAYSCALE);
        const hueRotateChange = this.updateRangeValue.bind(this, FILTER_FIELDS.HUE_ROTATE);
        const invertChange = this.updateRangeValue.bind(this, FILTER_FIELDS.INVERT);
        const saturateChange = this.updateRangeValue.bind(this, FILTER_FIELDS.SATURATE);
        const sepiaChange = this.updateRangeValue.bind(this, FILTER_FIELDS.SEPIA);

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
                                <sl-icon library="system" name="effects" label="${msg('Settings')}"></sl-icon>
                        </sl-button>
                        <div class="${classMap(editorControlsClasses)}" style="${styleMap(editorStyles)}">
                            <sl-card>
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
                                    <sl-range
                                        label="${msg('Blur')}"
                                        min="0"
                                        max="10"
                                        step="1"
                                        value="${this.filterBlur}"
                                        @sl-input="${blurChange}"></sl-range>
                                    <sl-range
                                        label="${msg('Brightness')}"
                                        min="0"
                                        max="3"
                                        step="0.01"
                                        value="${this.filterBrightness}"
                                        @sl-input="${brightnessChange}"></sl-range>
                                    <sl-range
                                        label="${msg('Contrast')}"
                                        min="0"
                                        max="3"
                                        step="0.01"
                                        value="${this.filterContrast}"
                                        @sl-input="${contrastChange}"></sl-range>
                                        <sl-range
                                        label="${msg('Grayscale')}"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value="${this.filterGrayscale}"
                                        @sl-input="${grayscaleChange}"></sl-range>
                                    <sl-range
                                        label="${msg('Hue Rotate')}"
                                        min="-360"
                                        max="360"
                                        step="1"
                                        value="${this.filterHueRotate}"
                                        @sl-input="${hueRotateChange}"></sl-range>
                                    <sl-range
                                        label="${msg('Invert')}"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value="${this.filterInvert}"
                                        @sl-input="${invertChange}"></sl-range>
                                    <sl-range
                                        label="${msg('Saturate')}"
                                        min="0"
                                        max="3"
                                        step="0.01"
                                        value="${this.filterSaturate}"
                                        @sl-input="${saturateChange}"></sl-range>
                                    <sl-range
                                        label="${msg('Sepia')}"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value="${this.filterSepia}"
                                        @sl-input="${sepiaChange}"></sl-range>
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
            filterCardSelected: this.filterBlur === filter.values.blur
                && this.filterBrightness === filter.values.brightness
                && this.filterContrast === filter.values.contrast
                && this.filterGrayscale === filter.values.grayscale
                && this.filterHueRotate === filter.values.hueRotate
                && this.filterInvert === filter.values.invert
                && this.filterSaturate === filter.values.saturate
                && this.filterSepia === filter.values.sepia
        };
        const filterStyle = {
            filter: `blur(${filter.values.blur}px)
                     brightness(${filter.values.brightness})
                     contrast(${filter.values.contrast})
                     grayscale(${filter.values.grayscale})
                     hue-rotate(${filter.values.hueRotate}deg)
                     invert(${filter.values.invert})
                     saturate(${filter.values.saturate})
                     sepia(${filter.values.sepia})`
        };
        const applyFilterBound = this.applyFilter.bind(this, filter.values);
        return html`
            <sl-card class="${classMap(filterClasses)}" @click="${applyFilterBound}">
                ${filterEmoteUrl ? html`
                    <img
                        class="filterEmotePreview"
                        style="${styleMap(filterStyle)}"
                        src="${filterEmoteUrl}"
                        alt="${msg(str`${ExtensionOverlay.filterExampleEmoteName} Twitch Emote With ${filter.name} Filter Applied`)}"
                    />
                ` : html`
                    <div class="filterPreview" style="${styleMap(filterStyle)}"></div>
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
            'backdrop-filter': `blur(${this.filterBlur}px)
                                brightness(${this.filterBrightness})
                                contrast(${this.filterContrast})
                                grayscale(${this.filterGrayscale})
                                hue-rotate(${this.filterHueRotate}deg)
                                invert(${this.filterInvert})
                                saturate(${this.filterSaturate})
                                sepia(${this.filterSepia})`,
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