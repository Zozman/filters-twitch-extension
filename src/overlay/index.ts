// Import used Shoelace componments
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/range/range.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/radio-button/radio-button.js';

// Configure shoelace icon library
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('shoelace');

// Normally, Shoelace loads icons in its system library by using a sheet
// Twitch Extensions do not like this and will block them
// Therefore we will just copy the SVGs to the `images` directory and then override the system library using them
// This will force Shoelace to load them via URL which Twitch Extensions are fine with
import gripVertical from '../images/grip-vertical.svg';
import mask from '../images/mask.svg';
import chevronRight from '../images/chevron-right.svg'
import xCircleFill from '../images/x-circle-fill.svg';
import search from '../images/search.svg';

const systemIconMap: Map<string, any> = new Map([
    ['grip-vertical', gripVertical],
    ['mask', mask],
    ['chevron-right', chevronRight],
    ['x-circle-fill', xCircleFill],
    ['search', search]
]);

registerIconLibrary('system', {
    resolver: name => systemIconMap.get(name),
    mutator: svg => svg.setAttribute('fill', 'currentColor')
});

import './extension-overlay';