import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/range/range.js';

import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('shoelace');

import gripVertical from '../images/grip-vertical.svg';
import mask from '../images/mask.svg';

const systemIconMap: Map<string, any> = new Map([
    ['grip-vertical', gripVertical],
    ['mask', mask]
]);

// Overriding this icon because the way it normally loads is not liked by Twitch
// CSP Violation and all
registerIconLibrary('system', {
    resolver: name => systemIconMap.get(name),
    mutator: svg => svg.setAttribute('fill', 'currentColor')
});

import './extension-overlay';