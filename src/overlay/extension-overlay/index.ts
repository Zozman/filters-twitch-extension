import { html, LitElement, nothing } from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import {styleMap} from 'lit-html/directives/style-map.js';
import {classMap} from 'lit-html/directives/class-map.js';

import {drag} from '../../shared/drag';
import {clamp} from '../../shared/clamp';

import { defaultFilterValues, filtersArray } from './filters';

import type { TwitchExtensionContext } from '../../types/twitch';

import style from './style.scss';
import { Filter, FILTER_FIELDS, FilterData } from './types';

@customElement('extension-overlay')
export class ExtensionOverlay extends LitElement {
    static styles = style;

    @state()
    private dividerPosition = -10;

    /**
     * Marks if we are currently dragging the divider
     * Used so we can disable pointer events on the left and right side during this
     */
    @state()
    private isDragging = false;

    @state()
    private editorActive = false;

    @state()
    private dividerActive = false;

    @query('.base')
    private base!: HTMLElement;

    // ----------------------------- Filter values -----------------------------

    @state()
    private filterBlur = defaultFilterValues.blur;

    @state()
    private filterBrightness = defaultFilterValues.brightness;

    @state()
    private filterContrast = defaultFilterValues.contrast;

    @state()
    private filterGrayscale = defaultFilterValues.grayscale;

    @state()
    private filterHueRotate = defaultFilterValues.hueRotate;

    @state()
    private filterInvert = defaultFilterValues.invert;

    @state()
    private filterSaturate = defaultFilterValues.saturate;

    @state()
    private filterSepia = defaultFilterValues.sepia;

    // ----------------------------- End Filter Values -----------------------------

    /**
     * Light or dark theme
     */
    @state()
    private theme = 'light';

    @state()
    private isAnimatingDivider = false;

    @state()
    private filterSearchTerm = '';

    /**
     * Used for local development to show content for the left side
     */
    private isLocalhost = window.location.hostname === 'localhost';

    /**
     * Test stream channel to show in the overlay
     */
    private testStreamChannel = 'qa_partner_sirhype';

    connectedCallback() {
        super.connectedCallback();
        // When the context changes, update the theme
        window.Twitch.ext.onContext((ctx:TwitchExtensionContext) => {
            this.theme = ctx.theme;
        });
    }

    private handleDrag(event: PointerEvent) {
        const { width } = this.base.getBoundingClientRect();
    
        event.preventDefault();
    
        drag(this.base, {
          onMove: x => {
            this.isDragging = true;
            this.dividerPosition = parseFloat(clamp((x / width) * 100, 0, 100).toFixed(2));
          },
          onStop: () => {
            this.isDragging = false;
          },
          initialEvent: event
        });
    }

    private toggleEditorControls() {
        this.editorActive = !this.editorActive;
    }

    /**
     * Toggle divider and animate it entering and exiting
     */
    private toggleDivider() {
        const newDividerState = !this.dividerActive;
        this.isAnimatingDivider = true;
        if (newDividerState) {
            this.dividerActive = newDividerState;
            setTimeout(() => {
                this.dividerPosition = 50;
                setTimeout(() => {
                    this.isAnimatingDivider = false;
                }, 500);
            }, 100);
        } else {
            setTimeout(() => {
                this.dividerPosition = -10;
                setTimeout(() => {
                    this.isAnimatingDivider = false;
                    this.dividerActive = newDividerState;
                }, 500);
            }, 100);
        }
    }

    private updateRangeValue(field:string, event:any) {
        const value = event.target.value;
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

    private updateFilterSearch(event:any) {
        const value = event.target.value;
        this.filterSearchTerm = value;
    }

    private applyFilter(filter:FilterData) {
        this.filterBlur = filter.blur;
        this.filterBrightness = filter.brightness;
        this.filterContrast = filter.contrast;
        this.filterGrayscale = filter.grayscale;
        this.filterHueRotate = filter.hueRotate;
        this.filterInvert = filter.invert;
        this.filterSaturate = filter.saturate;
        this.filterSepia = filter.sepia;
    }

    private reset() {
        this.applyFilter(defaultFilterValues);
        this.filterSearchTerm = '';
    }

    private renderEditor() {
        const editorControlsClasses = {
            editorControls: true,
            editorControlsVisible: this.editorActive
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
            <div class="editor">
                <div class="${classMap(editorControlsClasses)}">
                    <sl-card>
                        <sl-details summary="Filters" open>
                            <sl-input
                                .value="${this.filterSearchTerm}"
                                placeholder="Search"
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
                        <sl-details summary="Customize">
                            <sl-range
                                label="Blur"
                                min="0"
                                max="10"
                                step="1"
                                value="${this.filterBlur}"
                                @sl-input="${blurChange}"></sl-range>
                            <sl-range
                                label="Brightness"
                                min="0"
                                max="3"
                                step="0.01"
                                value="${this.filterBrightness}"
                                @sl-input="${brightnessChange}"></sl-range>
                            <sl-range
                                label="Contrast"
                                min="0"
                                max="3"
                                step="0.01"
                                value="${this.filterContrast}"
                                @sl-input="${contrastChange}"></sl-range>
                                <sl-range
                                label="Grayscale"
                                min="0"
                                max="1"
                                step="0.01"
                                value="${this.filterGrayscale}"
                                @sl-input="${grayscaleChange}"></sl-range>
                            <sl-range
                                label="Hue Rotate"
                                min="-360"
                                max="360"
                                step="1"
                                value="${this.filterHueRotate}"
                                @sl-input="${hueRotateChange}"></sl-range>
                            <sl-range
                                label="Invert"
                                min="0"
                                max="1"
                                step="0.01"
                                value="${this.filterInvert}"
                                @sl-input="${invertChange}"></sl-range>
                            <sl-range
                                label="Saturate"
                                min="0"
                                max="3"
                                step="0.01"
                                value="${this.filterSaturate}"
                                @sl-input="${saturateChange}"></sl-range>
                            <sl-range
                                label="Sepia"
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
                                >Enable Slider</sl-switch>
                            <sl-button
                                variant="default"
                                @click="${this.reset}">Reset</sl-button>
                        </div>
                    </sl-card>
                </div>
                <div class="editorToggle">
                    <sl-button
                        variant="default"
                        size="medium"
                        circle
                        @click="${this.toggleEditorControls}">
                            <sl-icon library="system" name="mask" label="Settings"></sl-icon>
                    </sl-button>
                </div>
            </div>
        `;
    }

    private renderFilter(filter:Filter) {
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
                <div class="filterPreview" style="${styleMap(filterStyle)}"></div>
                <div slot="footer">
                    ${filter.name}
                </div>
            </sl-card>
        `;
    }

    private renderDivider() {
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

    private renderTestStreamFrame() {
        const frameClasses = {
            baseItem: true,
            overlayFrame: true,
            blockActions: this.isDragging
        };
        return html`
            <iframe
                class="${classMap(frameClasses)}"
                src="https://player.twitch.tv/?channel=${this.testStreamChannel}&parent=${window.location.hostname}"
                height="100%"
                width="100%"
                autoplay="true"
                muted="true">
            </iframe>
        `;
    }
    
    render() {
        const baseClasses = {
            base: true,
            dark: this.theme === 'dark',
            light: this.theme === 'light'
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
            // Only clip if divider is enabled
            ...(this.dividerActive && {'clip-path': `polygon(${this.dividerPosition}% 0, 100% 0, 100% 100%, ${this.dividerPosition}% 100%)`})
        };
        const filterClasses = {
            baseItem: true,
            filter: true,
            blockActions: this.isDragging,
            dividerAnimating: this.isAnimatingDivider
        };
        return html`
            <div
                class="${classMap(baseClasses)}">
                    ${this.renderEditor()}
                    ${this.dividerActive ? this.renderDivider() : nothing}
                    <div class="${classMap(filterClasses)}" style="${styleMap(filterStyle)}"></div>
                    ${this.isLocalhost ? this.renderTestStreamFrame() : nothing}
            </div>
        `;
    }
}