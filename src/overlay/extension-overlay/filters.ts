import { FilterData, Filter } from "./types";

/**
 * Values for the default filter (no filter applied)
 */
export const defaultFilterValues:FilterData = {
    blur: 0,
    brightness: 1,
    contrast: 1,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    saturate: 1,
    sepia: 0
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
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L16
    {
        name: '1977',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.5,
                hueRotate: -30,
                saturate: 1.4
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L21
    {
        name: 'Aden',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.2,
                brightness: 1.15,
                saturate: 1.4
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L32
    {
        name: 'Amaro',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.35,
                contrast: 1.1,
                brightness: 1.2,
                saturate: 1.3
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L43
    {
        name: 'Ashby',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.5,
                contrast: 1.2,
                saturate: 1.8
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L54
    {
        name: 'Brannan',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.4,
                contrast: 1.25,
                brightness: 1.1,
                saturate: 0.9,
                hueRotate: -2
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L59
    {
        name: 'Brooklyn',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.25,
                brightness: 1.25,
                hueRotate: 5
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L70
    {
        name: 'Charmes',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.25,
                brightness: 1.25,
                saturate: 1.35,
                hueRotate: -5
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L81
    {
        name: 'Clarendon',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.15,
                contrast: 1.25,
                brightness: 1.25,
                hueRotate: 5
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L92
    {
        name: 'Crema',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.5,
                contrast: 1.25,
                brightness: 1.15,
                saturate: 0.9,
                hueRotate: -2
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L103
    {
        name: 'Dogpatch',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.35,
                saturate: 1.1,
                contrast: 1.5
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L108
    {
        name: 'Earlybird',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.25,
                brightness: 1.15,
                saturate: 0.9,
                hueRotate: -5
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L122
    {
        name: 'Gingham',
        values: {
            ...defaultFilterValues,
            ...{
                contrast: 1.1,
                brightness: 1.1
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L133
    {
        name: 'Ginza',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.15,
                brightness: 1.2,
                saturate: 1.35,
                hueRotate: -5
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L144
    {
        name: 'Hefe',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.4,
                contrast: 1.5,
                brightness: 1.2,
                saturate: 1.4,
                hueRotate: -10
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L158
    {
        name: 'Helena',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.5,
                contrast: 1.05,
                brightness: 1.05,
                saturate: 1.35
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L169
    {
        name: 'Hudson',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.2,
                brightness: 1.2,
                saturate: 1.05,
                hueRotate: -15
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L183
    {
        name: 'Inkwell',
        values: {
            ...defaultFilterValues,
            ...{
                brightness: 1.25,
                contrast: 0.85,
                grayscale: 1
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L188
    {
        name: 'Juno',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.35,
                contrast: 1.15,
                brightness: 1.15,
                saturate: 1.8
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L199
    {
        name: 'Kelvin',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.15,
                contrast: 1.5,
                brightness: 1.1,
                hueRotate: -10
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L213
    {
        name: 'Lark',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.2,
                brightness: 1.3,
                saturate: 1.25
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L218
    {
        name: 'Lofi',
        values: {
            ...defaultFilterValues,
            ...{
                saturate: 1.1,
                contrast: 1.5
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L223
    {
        name: 'Ludwig',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.05,
                brightness: 1.05,
                saturate: 2
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L234
    {
        name: 'Maven',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.35,
                contrast: 1.05,
                brightness: 1.05,
                saturate: 1.75
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L245
    {
        name: 'Mayfair',
        values: {
            ...defaultFilterValues,
            ...{
                contrast: 1.1,
                brightness: 1.15,
                saturate: 1.1
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L259
    {
        name: 'Moon',
        values: {
            ...defaultFilterValues,
            ...{
                brightness: 1.4,
                contrast: 0.95,
                saturate: 0,
                sepia: 0.35
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L264
    {
        name: 'Nashville',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.5,
                brightness: 0.9,
                hueRotate: -15
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L278
    {
        name: 'Perpetua',
        values: {
            ...defaultFilterValues,
            ...{
                contrast: 1.1,
                brightness: 1.25,
                saturate: 1.1
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L293
    {
        name: 'Poprocket',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.15,
                brightness: 1.2
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L307
    {
        name: 'Reyes',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.75,
                contrast: 0.75,
                brightness: 1.25,
                saturate: 1.4
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L312
    {
        name: 'Rise',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.25,
                brightness: 1.2,
                saturate: 0.9
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L326
    {
        name: 'Sierra',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.5,
                brightness: 0.9,
                hueRotate: -15
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L340
    {
        name: 'Skyline',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.15,
                contrast: 1.25,
                brightness: 1.25,
                saturate: 1.2
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L345
    {
        name: 'Slumber',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.35,
                contrast: 1.25,
                saturate: 1.25
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L356
    {
        name: 'Stinson',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.35,
                contrast: 1.25,
                brightness: 1.1,
                saturate: 1.25
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L367
    {
        name: 'Sutro',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.4,
                contrast: 1.2,
                brightness: 0.9,
                saturate: 1.4,
                hueRotate: -10
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L381
    {
        name: 'Toaster',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.5,
                brightness: 0.95,
                hueRotate: -15
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L395
    {
        name: 'Valencia',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.25,
                contrast: 1.1,
                brightness: 1.1
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L406
    {
        name: 'Vesper',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.35,
                contrast: 1.15,
                brightness: 1.2,
                saturate: 1.3
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L417
    {
        name: 'Walden',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.35,
                contrast: 0.8,
                brightness: 1.25,
                saturate: 1.4
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L428
    {
        name: 'Willow',
        values: {
            ...defaultFilterValues,
            ...{
                brightness: 1.2,
                contrast: 0.85,
                saturate: 0.05,
                sepia: 0.2
            }
        }
    },
    // From https://github.com/picturepan2/instagram.css/blob/master/dist/instagram.css#L433
    {
        name: 'X-Pro II',
        values: {
            ...defaultFilterValues,
            ...{
                sepia: 0.45,
                contrast: 1.25,
                brightness: 1.75,
                saturate: 1.3,
                hueRotate: -5
            }
        }
    }
]