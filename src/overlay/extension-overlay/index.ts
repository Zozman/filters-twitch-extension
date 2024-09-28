import { html, LitElement, nothing } from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import {styleMap} from 'lit-html/directives/style-map.js';
import {classMap} from 'lit-html/directives/class-map.js';

import {drag} from '../../shared/drag';
import {clamp} from '../../shared/clamp';

import type { TwitchExtensionContext } from '../../types/twitch';

import style from './style.scss';

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

    private defaultFilterBlue = 0;

    @state()
    private filterBlur = this.defaultFilterBlue;

    private defaultFilterBrightness = 1;

    @state()
    private filterBrightness = this.defaultFilterBrightness;

    private defaulFilerContrast = 1;

    @state()
    private filterContrast = this.defaulFilerContrast;

    private defaultFilterGrayscale= 0;

    @state()
    private filterGrayscale = this.defaultFilterGrayscale;

    private defaultFilterHueRotate = 0;

    @state()
    private filterHueRotate = this.defaultFilterHueRotate;

    private defaultFilterInvert = 0;

    @state()
    private filterInvert = this.defaultFilterInvert;

    private defaultFilterSaturate = 1;

    @state()
    private filterSaturate = this.defaultFilterSaturate;

    private defaultFilterSepia = 0;

    @state()
    private filterSepia = this.defaultFilterSepia;

    // ----------------------------- End Filter Values -----------------------------

    /**
     * Light or dark theme
     */
    @state()
    private theme = 'light';

    @state()
    private isAnimatingDivider = false;

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
        if (field === 'blur') {
            this.filterBlur = value;
        }
        if (field === 'brightness') {
            this.filterBrightness = value;
        }
        if (field === 'contrast') {
            this.filterContrast = value;
        }
        if (field === 'grayscale') {
            this.filterGrayscale = value;
        }
        if (field === 'hue-rotate') {
            this.filterHueRotate = value;
        }
        if (field === 'invert') {
            this.filterInvert = value;
        }
        if (field === 'saturate') {
            this.filterSaturate = value;
        }
        if (field === 'sepia') {
            this.filterSepia = value;
        }
    }

    private reset() {
        this.filterBlur = this.defaultFilterBlue;
        this.filterBrightness = this.defaultFilterBrightness;
        this.filterContrast = this.defaulFilerContrast;
        this.filterGrayscale = this.defaultFilterGrayscale;
        this.filterHueRotate = this.defaultFilterHueRotate;
        this.filterInvert = this.defaultFilterInvert;
        this.filterSaturate = this.defaultFilterSaturate;
        this.filterSepia = this.defaultFilterSepia;
    }

    private renderEditor() {
        const editorControlsClasses = {
            editorControls: true
        };

        const blurChange = this.updateRangeValue.bind(this, 'blur');
        const brightnessChange = this.updateRangeValue.bind(this, 'brightness');
        const contrastChange = this.updateRangeValue.bind(this, 'contrast');
        const grayscaleChange = this.updateRangeValue.bind(this, 'grayscale');
        const hueRotateChange = this.updateRangeValue.bind(this, 'hue-rotate');
        const invertChange = this.updateRangeValue.bind(this, 'invert');
        const saturateChange = this.updateRangeValue.bind(this, 'saturate');
        const sepiaChange = this.updateRangeValue.bind(this, 'sepia');
        return html`
            <div class="editor">
                ${this.editorActive ? html`
                    <div class="${classMap(editorControlsClasses)}">
                        <sl-card>
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
                                step="0.1"
                                value="${this.filterBrightness}"
                                @sl-input="${brightnessChange}"></sl-range>
                            <sl-range
                                label="Contrast"
                                min="0"
                                max="3"
                                step="0.1"
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
                                min="0"
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
                                step="0.1"
                                value="${this.filterSaturate}"
                                @sl-input="${saturateChange}"></sl-range>
                            <sl-range
                                label="Sepia"
                                min="0"
                                max="1"
                                step="0.01"
                                value="${this.filterSepia}"
                                @sl-input="${sepiaChange}"></sl-range>
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
                ` : nothing}
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
        return html`
            <iframe
                class="baseItem overlayFrame blockActions"
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