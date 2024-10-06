// Import used shoelace components
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/carousel/carousel.js';
import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js';

// Configure shoelace icon library
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('shoelace');

// Normally, Shoelace loads icons in its system library by using a sheet
// Twitch Extensions do not like this and will block them
// Therefore we will just copy the SVGs to the `images` directory and then override the system library using them
// This will force Shoelace to load them via URL which Twitch Extensions are fine with
import chevronLeft from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/chevron-left.svg';
import chevronRight from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/chevron-right.svg';

// Non-shoelace icon but we will add it to the system library as well for convienence
import filters from '../images/filters.svg';

const systemIconMap: Map<string, any> = new Map([
    ['chevron-left', chevronLeft],
    ['chevron-right', chevronRight],
    ['filters', filters],
]);

registerIconLibrary('system', {
    resolver: name => systemIconMap.get(name),
    mutator: svg => svg.setAttribute('fill', 'currentColor')
});

import './extension-config';