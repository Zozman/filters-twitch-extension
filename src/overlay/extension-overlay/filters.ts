import { FilterData, Filter, MIX_BLEND_MODE, FILTER_FIELDS } from "./types";

/**
 * Values for the default filter (no filter applied)
 */
export const defaultFilterValues:FilterData = {
    [FILTER_FIELDS.BLUR]: 0,
    [FILTER_FIELDS.BRIGHTNESS]: 1,
    [FILTER_FIELDS.CONTRAST]: 1,
    [FILTER_FIELDS.GRAYSCALE]: 0,
    [FILTER_FIELDS.HUE_ROTATE]: 0,
    [FILTER_FIELDS.INVERT]: 0,
    [FILTER_FIELDS.SATURATE]: 1,
    [FILTER_FIELDS.SEPIA]: 0,
    [FILTER_FIELDS.BACKGROUND]: '',
    [FILTER_FIELDS.OPACITY]: 0,
    [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.NORMAL
};

/**
 * Default filter definiton
 */
export const filterDefault:Filter = {
    name: 'Default',
    values: defaultFilterValues
};

/**
 * Array of available filters to render in the Filter Selector
 */
export const filtersArray: Array<Filter> = [
    filterDefault,
    // From https://github.com/una/CSSgram/blob/master/source/css/1977.css
    {
        name: '1977',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.CONTRAST]: 1.1,
                [FILTER_FIELDS.BRIGHTNESS]: 1.1,
                [FILTER_FIELDS.SATURATE]: 1.3,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(243, 106, 188)',
                [FILTER_FIELDS.OPACITY]: 0.3,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.SCREEN
            }
        }
    },
    // From https://github.com/mdbootstrap/mdb-ui-kit
    {
        name: 'Aden',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.CONTRAST]: 0.9,
                [FILTER_FIELDS.BRIGHTNESS]: 1.2,
                [FILTER_FIELDS.SATURATE]: 0.85,
                [FILTER_FIELDS.HUE_ROTATE]: 20,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(125, 105, 24)',
                [FILTER_FIELDS.OPACITY]: 0.1,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.DARKEN
            }
        }
    },
    // From https://github.com/mdbootstrap/mdb-ui-kit
    {
        name: 'Amaro',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.CONTRAST]: 0.9,
                [FILTER_FIELDS.BRIGHTNESS]: 1.1,
                [FILTER_FIELDS.SATURATE]: 1.5,
                [FILTER_FIELDS.HUE_ROTATE]: -10,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.NORMAL
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L43
    {
        name: 'Ashby',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.5,
                [FILTER_FIELDS.CONTRAST]: 1.2,
                [FILTER_FIELDS.SATURATE]: 1.8,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(125, 105, 24)',
                [FILTER_FIELDS.OPACITY]: 0.35,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.LIGHTEN
            }
        }
    },
    // From https://github.com/una/CSSgram/blob/master/source/scss/brannan.scss
    {
        name: 'Brannan',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.4,
                [FILTER_FIELDS.CONTRAST]: 1.4,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(161, 44, 199)',
                [FILTER_FIELDS.OPACITY]: 0.31,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.LIGHTEN
            }
        }
    },
    // From https://github.com/mdbootstrap/mdb-ui-kit
    {
        name: 'Brooklyn',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.CONTRAST]: 0.9,
                [FILTER_FIELDS.BRIGHTNESS]: 1.1,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(127, 187, 227)',
                [FILTER_FIELDS.OPACITY]: 0.2,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.OVERLAY
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L70
    {
        name: 'Charmes',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.25,
                [FILTER_FIELDS.CONTRAST]: 1.25,
                [FILTER_FIELDS.BRIGHTNESS]: 1.25,
                [FILTER_FIELDS.SATURATE]: 1.35,
                [FILTER_FIELDS.HUE_ROTATE]: -5,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(125, 105, 24)',
                [FILTER_FIELDS.OPACITY]: 0.25,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.DARKEN
            }
        }
    },
    // From https://github.com/una/CSSgram/blob/master/source/scss/clarendon.scss
    {
        name: 'Clarendon',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.CONTRAST]: 1.2,
                [FILTER_FIELDS.SATURATE]: 1.35,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(127, 187, 227)',
                [FILTER_FIELDS.OPACITY]: 0.2,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.OVERLAY
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L92
    {
        name: 'Crema',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.5,
                [FILTER_FIELDS.CONTRAST]: 1.25,
                [FILTER_FIELDS.BRIGHTNESS]: 1.15,
                [FILTER_FIELDS.SATURATE]: 0.9,
                [FILTER_FIELDS.HUE_ROTATE]: -2,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(125, 105, 24)',
                [FILTER_FIELDS.OPACITY]: 0.2,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.MULTIPLY
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L103
    {
        name: 'Dogpatch',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.35,
                [FILTER_FIELDS.SATURATE]: 1.1,
                [FILTER_FIELDS.CONTRAST]: 1.5
            }
        }
    },
    // From https://github.com/una/CSSgram/blob/master/source/scss/gingham.scss
    {
        name: 'Gingham',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.BRIGHTNESS]: 1.05,
                [FILTER_FIELDS.HUE_ROTATE]: -10,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(230, 230, 250)',
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.SOFT_LIGHT
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L133
    {
        name: 'Ginza',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.25,
                [FILTER_FIELDS.CONTRAST]: 1.15,
                [FILTER_FIELDS.BRIGHTNESS]: 1.2,
                [FILTER_FIELDS.SATURATE]: 1.35,
                [FILTER_FIELDS.HUE_ROTATE]: -5,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(125, 105, 24)',
                [FILTER_FIELDS.OPACITY]: 0.15,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.DARKEN
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L158
    {
        name: 'Helena',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.5,
                [FILTER_FIELDS.CONTRAST]: 1.05,
                [FILTER_FIELDS.BRIGHTNESS]: 1.05,
                [FILTER_FIELDS.SATURATE]: 1.35,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(158, 175, 30)',
                [FILTER_FIELDS.OPACITY]: 0.25,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.OVERLAY
            }
        }
    },
    // From https://github.com/mdbootstrap/mdb-ui-kit
    {
        name: 'Inkwell',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.BRIGHTNESS]: 1.1,
                [FILTER_FIELDS.CONTRAST]: 1.1,
                [FILTER_FIELDS.SEPIA]: 0.3,
                [FILTER_FIELDS.GRAYSCALE]: 1
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L188
    {
        name: 'Juno',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.35,
                [FILTER_FIELDS.CONTRAST]: 1.15,
                [FILTER_FIELDS.BRIGHTNESS]: 1.15,
                [FILTER_FIELDS.SATURATE]: 1.8,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(127, 187, 227)',
                [FILTER_FIELDS.OPACITY]: 0.2,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.OVERLAY
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L213
    {
        name: 'Lark',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.25,
                [FILTER_FIELDS.CONTRAST]: 1.2,
                [FILTER_FIELDS.BRIGHTNESS]: 1.3,
                [FILTER_FIELDS.SATURATE]: 1.25
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L218
    {
        name: 'Lofi',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SATURATE]: 1.1,
                [FILTER_FIELDS.CONTRAST]: 1.5
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L223
    {
        name: 'Ludwig',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.25,
                [FILTER_FIELDS.CONTRAST]: 1.05,
                [FILTER_FIELDS.BRIGHTNESS]: 1.05,
                [FILTER_FIELDS.SATURATE]: 2,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(125, 105, 24)',
                [FILTER_FIELDS.OPACITY]: 0.1,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.OVERLAY
            }
        }
    },
    // From https://github.com/mdbootstrap/mdb-ui-kit
    {
        name: 'Maven',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.CONTRAST]: 0.95,
                [FILTER_FIELDS.BRIGHTNESS]: 0.95,
                [FILTER_FIELDS.SATURATE]: 1.5,
                [FILTER_FIELDS.SEPIA]: 0.25,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(3, 230, 26)',
                [FILTER_FIELDS.OPACITY]: 0.2,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.HUE
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L259
    {
        name: 'Moon',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.BRIGHTNESS]: 1.4,
                [FILTER_FIELDS.CONTRAST]: 0.95,
                [FILTER_FIELDS.SATURATE]: 0,
                [FILTER_FIELDS.SEPIA]: 0.35
            }
        }
    },
    // From https://github.com/una/CSSgram/blob/master/source/scss/reyes.scss
    {
        name: 'Reyes',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.22,
                [FILTER_FIELDS.BRIGHTNESS]: 1.1,
                [FILTER_FIELDS.CONTRAST]: 0.85,
                [FILTER_FIELDS.SATURATE]: 0.75,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(239, 205, 173)',
                [FILTER_FIELDS.OPACITY]: 0.5,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.SOFT_LIGHT
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L340
    {
        name: 'Skyline',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.15,
                [FILTER_FIELDS.CONTRAST]: 1.25,
                [FILTER_FIELDS.BRIGHTNESS]: 1.25,
                [FILTER_FIELDS.SATURATE]: 1.2
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L345
    {
        name: 'Slumber',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.35,
                [FILTER_FIELDS.CONTRAST]: 1.25,
                [FILTER_FIELDS.SATURATE]: 1.25,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(125, 105, 24)',
                [FILTER_FIELDS.OPACITY]: 0.2,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.DARKEN
            }
        }
    },
    // From https://github.com/mdbootstrap/mdb-ui-kit
    {
        name: 'Stinson',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.CONTRAST]: 0.75,
                [FILTER_FIELDS.BRIGHTNESS]: 1.15,
                [FILTER_FIELDS.SATURATE]: 0.85,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(240, 149, 128)',
                [FILTER_FIELDS.OPACITY]: 0.2,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.SOFT_LIGHT
            }
        }
    },
    // From https://github.com/una/CSSgram/blob/master/source/scss/valencia.scss
    {
        name: 'Valencia',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.CONTRAST]: 1.08,
                [FILTER_FIELDS.BRIGHTNESS]: 1.08,
                [FILTER_FIELDS.SEPIA]: 0.08,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(58, 3, 57)',
                [FILTER_FIELDS.OPACITY]: 0.5,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.EXCLUSION
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L406
    {
        name: 'Vesper',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.35,
                [FILTER_FIELDS.CONTRAST]: 1.15,
                [FILTER_FIELDS.BRIGHTNESS]: 1.2,
                [FILTER_FIELDS.SATURATE]: 1.3,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(125, 105, 24)',
                [FILTER_FIELDS.OPACITY]: 0.25,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.OVERLAY
            }
        }
    },
    // From https://github.com/mdbootstrap/mdb-ui-kit
    {
        name: 'Walden',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.CONTRAST]: 1.1,
                [FILTER_FIELDS.BRIGHTNESS]: 1.6,
                [FILTER_FIELDS.SEPIA]: 0.3,
                [FILTER_FIELDS.HUE_ROTATE]: 350,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(204, 68, 0)',
                [FILTER_FIELDS.OPACITY]: 0.33,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.SCREEN
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L428
    {
        name: 'Willow',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.BRIGHTNESS]: 1.2,
                [FILTER_FIELDS.CONTRAST]: 0.85,
                [FILTER_FIELDS.SATURATE]: 0.05,
                [FILTER_FIELDS.SEPIA]: 0.2
            }
        }
    },
    // From https://github.com/mdbootstrap/mdb-ui-kit
    {
        name: 'Xpro2',
        values: {
            ...defaultFilterValues,
            ...{
                [FILTER_FIELDS.SEPIA]: 0.3,
                [FILTER_FIELDS.BACKGROUND]: 'rgb(62, 162, 253)',
                [FILTER_FIELDS.OPACITY]: 0.5,
                [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE.COLOR_BURN
            }
        }
    }
]