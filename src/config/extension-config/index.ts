import { html } from 'lit';
import {customElement } from 'lit/decorators.js';
import { ExtensionBase } from '../../extension-base';
import {msg} from '@lit/localize';

import style from './style.scss';

/**
 * Main component for the application
 */
@customElement('extension-config')
export default class ExtensionConfig extends ExtensionBase {
    static styles = style;

    render() {
        return html`
            <sl-card class="holderCard">
                <div class="cardBody">
                    <sl-icon library="system" name="filters"></sl-icon>
                    <div>${msg('No Configuration Needed.')}</div>
                    <div>${msg('Have Fun!')}</div>
                </div>
            </sl-card>
        `;
    }
}