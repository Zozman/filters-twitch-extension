import { html, PropertyValues } from 'lit';
import {customElement, state, query } from 'lit/decorators.js';
import {msg, str} from '@lit/localize';

import { ExtensionBase } from '../../extension-base';

import style from './style.scss';

import demoStep1Light from '../../images/demoStep1Light.webp';
import demoStep2Light from '../../images/demoStep2Light.webp';
import demoStep3Light from '../../images/demoStep3Light.webp';

import demoStep1Dark from '../../images/demoStep1Dark.webp';
import demoStep2Dark from '../../images/demoStep2Dark.webp';
import demoStep3Dark from '../../images/demoStep3Dark.webp';
import { TWITCH_THEMES, TwitchExtensionContext } from '../../types/twitch';
import { SlCarousel, SlSlideChangeEvent } from '@shoelace-style/shoelace';

/**
 * The steps for the demo carosall
 */
const demoSteps = [
    {
        'text': msg('Click the button to open the filter menu and select a filter to apply it.'),
        'lightImageUrl': demoStep1Light,
        'darkImageUrl': demoStep1Dark
    },
    {
        'text': msg('Enable the Filter Slider to adjust what side of the screen is filtered, and feel free to move around the menu by dragging the button.'),
        'lightImageUrl': demoStep2Light,
        'darkImageUrl': demoStep2Dark
    },
    {
        'text': 'Use the Customize menu to adjust your filter or make one from scratch.',
        'lightImageUrl': demoStep3Light,
        'darkImageUrl': demoStep3Dark
    }
];

/**
 * Configuration page for the extension
 */
@customElement('extension-config')
export default class ExtensionConfig extends ExtensionBase {
    static styles = style;

    /**
     * What step is currently being shown for the extension demo
     */
    @state()
    private currentDemoStep = 0;

    /**
     * The sliding demo carousel
     */
    @query('.demoCarousel')
    private demoCarousel!: SlCarousel;

    /**
     * List of promises to resolve when the Twitch extension context changes
     */
    protected onTwitchExtensionContext = (context:TwitchExtensionContext) => [
        this.twitchExtensionContextUpdate(context)
     ]

     /**
     * Function to run when the Twitch extension context changes
     * @param context `TwitchExtensionContext` object
     * @returns 
     */
    private twitchExtensionContextUpdate(context:TwitchExtensionContext):Promise<void> {
        this.theme = context.theme as TWITCH_THEMES;
        return Promise.resolve();
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        // For SOME reason inside of Twitch, the demo step is on step 3 when it loads and this DOES NOT happen locally
        // So this is a DIRTY HACK to ensure we start on the first step
        setTimeout(() => {
            this.demoCarousel.goToSlide(0, 'instant');
        }, 100);
    }

    /**
     * Handler to update `this.currentDemoStep` when the demo carousel changes so we can show the right text
     */
    private onSlideChange = (event: SlSlideChangeEvent) => {
        this.currentDemoStep = event.detail.index;
    }

    render() {
        return html`
            <sl-card class="holderCard">
                <div slot="header" class="holderCardHeader">${msg("No configuration required, so here's how to use Filters.")}</div>
                <sl-carousel
                    class="demoCarousel"
                    pagination
                    navigation
                    mouse-dragging
                    loop
                    @sl-slide-change="${this.onSlideChange}">
                        ${demoSteps.map((demoStep, index) => html`
                            <sl-carousel-item>
                                <img
                                    alt="${msg(str`Demo step ${index + 1} using the ${this.theme} theme`)}"
                                    src="${this.theme === TWITCH_THEMES.LIGHT ? demoStep.lightImageUrl : demoStep.darkImageUrl}"
                                />
                            </sl-carousel-item>
                        `)}
                </sl-carousel>
                <div slot="footer" class="holderFooter">
                    ${demoSteps[this.currentDemoStep].text}
                </div>
            </sl-card>
        `;
    }
}