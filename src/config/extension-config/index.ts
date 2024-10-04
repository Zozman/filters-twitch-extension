import { html } from 'lit';
import {customElement } from 'lit/decorators.js';
import { ExtensionBase } from '../../extension-base';

import style from './style.scss';

/**
 * Main component for the application
 */
@customElement('extension-config')
export default class ExtensionConfig extends ExtensionBase {
    static styles = style;

    render() {
        return html`
            <sl-card class="holderCard">No Config Needed!</sl-card>
        `;
    }
}