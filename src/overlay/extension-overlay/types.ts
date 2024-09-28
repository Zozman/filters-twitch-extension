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

interface TwitchEmoteImages {
    url_1x: string;
    url_2x: string;
    url_4x: string;
}

export interface TwitchEmote {
    id: string;
    name: string;
    images: TwitchEmoteImages,
    tier: string;
    emote_type: string;
    emote_set_id: string;
    format: Array<string> | string;
    scale: Array<string> | string;
    theme_mode: Array<string> | string;
    template: string;
}

export interface EmoteMapItem {
    id: string;
    format: string;
    scale: string;
    theme_mode: string;
    template: string;
}