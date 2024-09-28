export enum FILTER_FIELDS {
    BLUR = 'blur',
    BRIGHTNESS = 'brightness',
    CONTRAST = 'contrast',
    GRAYSCALE = 'grayscale',
    HUE_ROTATE = 'hueRotate',
    INVERT = 'invert',
    SATURATE = 'saturate',
    SEPIA = 'sepia'
}

export interface FilterData {
    [FILTER_FIELDS.BLUR]: number,
    [FILTER_FIELDS.BRIGHTNESS]: number,
    [FILTER_FIELDS.CONTRAST]: number,
    [FILTER_FIELDS.GRAYSCALE]: number,
    [FILTER_FIELDS.HUE_ROTATE]: number,
    [FILTER_FIELDS.INVERT]: number,
    [FILTER_FIELDS.SATURATE]: number,
    [FILTER_FIELDS.SEPIA]: number
}

export interface Filter {
    name: string,
    values: FilterData
}