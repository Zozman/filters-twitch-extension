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
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/color-picker/color-picker.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';

// Configure shoelace icon library
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('shoelace');

// Normally, Shoelace loads icons in its system library by using a sheet
// Twitch Extensions do not like this and will block them
// Therefore we will just copy the SVGs to the `images` directory and then override the system library using them
// This will force Shoelace to load them via URL which Twitch Extensions are fine with
import gripVertical from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/grip-vertical.svg';
import mask from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/mask.svg';
import chevronDown from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/chevron-down.svg'
import chevronRight from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/chevron-right.svg'
import xCircleFill from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/x-circle-fill.svg';
import search from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/search.svg';
import sun from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/sun.svg';
import moon from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/moon.svg';
import eyedropper from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/eyedropper.svg'

// Non-shoelace icon but we will add it to the system library as well for convienence
import filters from '../images/filters.svg';

const systemIconMap: Map<string, any> = new Map([
    ['grip-vertical', gripVertical],
    ['mask', mask],
    ['chevron-down', chevronDown],
    ['chevron-right', chevronRight],
    ['x-circle-fill', xCircleFill],
    ['search', search],
    ['sun', sun],
    ['moon', moon],
    ['filters', filters],
    ['eyedropper', eyedropper]
]);

registerIconLibrary('system', {
    resolver: name => systemIconMap.get(name),
    mutator: svg => svg.setAttribute('fill', 'currentColor')
});

import './extension-overlay';