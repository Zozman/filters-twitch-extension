import { TWITCH_THEMES } from "../../types/twitch";

/**
 * Enum representing what side the filter is on when the divider is enabled
 */
export enum FILTER_SIDE {
    /**
     * Filter is on the left side
     */
    LEFT = 'left',
    /**
     * Filter is on the right side
     */
    RIGHT = 'right'
}

/**
 * Enum representing blend modes used by `mix-blend-mode`
 * 
 * https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
 */
export enum MIX_BLEND_MODE {
    NORMAL = 'normal',
    MULTIPLY = 'multiply',
    SCREEN = 'screen',
    OVERLAY = 'overlay',
    DARKEN = 'darken',
    LIGHTEN = 'lighten',
    COLOR_DODGE = 'color-dodge',
    COLOR_BURN = 'color-burn',
    HARD_LIGHT = 'hard-light',
    SOFT_LIGHT = 'soft-light',
    DIFFERENCE = 'difference',
    EXCLUSION = 'exclusion',
    HUE = 'hue',
    SATURATION = 'saturation',
    COLOR = 'color',
    LUMINOSITY = 'luminosity',
    PLUS_DARKER = 'plus-darker',
    PLUS_LIGHTER = 'plus-lighter'
};

/**
 * Emum representing the fields that make up a FilterData object
 */
export enum FILTER_FIELDS {
    /**
     * Applies a Gaussian blur to the element.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur
     */
    BLUR = 'blur',
    /**
     * Applies a linear multiplier value on an element, makiong the element appear brighter or darker.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/brightness
     */
    BRIGHTNESS = 'brightness',
    /**
     * Adjusts the contrast of the element.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/contrast
     */
    CONTRAST = 'contrast',
    /**
     * Converts the input to grayscale.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/grayscale
     */
    GRAYSCALE = 'grayscale',
    /**
     * Rotates the hue of an element.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/hue-rotate
     */
    HUE_ROTATE = 'hue-rotate',
    /**
     * Inverts the color sample in the input element.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert
     */
    INVERT = 'invert',
    /**
     * Super-saturates or desaturates the imput element.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/saturate
     */
    SATURATE = 'saturate',
    /**
     * Converts the imput element to sepia, giving it a warmer, more tellow/brown appearance.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/sepia
     */
    SEPIA = 'sepia',
    /**
     * Background color to apply to the element's filter.
     * 
     * Can be either an empty string or a valid RGBA color value.
     * 
     * Used in `background-color` CSS fields.
     */
    BACKGROUND = 'background',
    /**
     * Opacity of the filter.
     * 
     * Used in `opacity` CSS fields.
     */
    OPACITY = 'opacity',
    /**
     * Blend mode used by the filter.
     * 
     * Used in `mix-blend-mode` CSS fields
     */
    MIX_BLEND_MODE = 'mix-blend-mode'
}

/**
 * Object containing the combined data to make up a Filter
 */
export interface FilterData {
    [FILTER_FIELDS.BLUR]: number,
    [FILTER_FIELDS.BRIGHTNESS]: number,
    [FILTER_FIELDS.CONTRAST]: number,
    [FILTER_FIELDS.GRAYSCALE]: number,
    [FILTER_FIELDS.HUE_ROTATE]: number,
    [FILTER_FIELDS.INVERT]: number,
    [FILTER_FIELDS.SATURATE]: number,
    [FILTER_FIELDS.SEPIA]: number,
    [FILTER_FIELDS.BACKGROUND]: string,
    [FILTER_FIELDS.OPACITY]: number,
    [FILTER_FIELDS.MIX_BLEND_MODE]: MIX_BLEND_MODE
}

/**
 * Formal definition of a Filter
 */
export interface Filter {
    /**
     * A human-readable name to represent a filter
     */
    name: string,
    /**
     * The underlying values needed to create a filter
     */
    values: FilterData
}

/**
 * Represents the different URLs available for a Twitch Emote based on their size
 * 
 * See https://dev.twitch.tv/docs/api/reference/#get-emote-sets for details
 */
interface TwitchEmoteImages {
    /**
     * Emote URL for 1x scale
     */
    url_1x: string;
    /**
     * Emote URL for 2x scale
     */
    url_2x: string;
    /**
     * Emote URL for 3x scale
     */
    url_4x: string;
}

/**
 * The type of emote.  Exists for emotes from an Emote Set
 * 
 * See https://dev.twitch.tv/docs/api/reference/#get-emote-sets -> `Response Body` -> `emote_type` for reference.
 */
enum TWITCH_EMOTE_TYPES {
    /**
     * A Bits tier emote
     */
    BITSTIER = 'bitstier',
    /**
     * A follower emote
     */
    FOLLOWER = 'follower',
    /**
     * A subscriber emote
     */
    SUBSCRIPTIONS = 'subscriptions'
}

/**
 * The formats that the emote is available in. For example, if the emote is available only as a static PNG, the array contains only `static`. But if the emote is available as a static PNG and an animated GIF, the array contains `static` and `animated`.
 * 
 * See https://dev.twitch.tv/docs/api/reference/#get-emote-sets -> `Response Body` -> `format` for reference.
 */
export enum TWITCH_EMOTE_FORMATS {
    ANIMATED = 'animated',
    STATIC = 'static'
}

/**
 * The sizes that the emote is available in.
 * 
 * See https://dev.twitch.tv/docs/api/reference/#get-emote-sets -> `Response Body` -> `format` for reference.
 */
export enum TWITCH_EMOTE_SCALE {
    /**
     *  A small version (28px x 28px) is available.
     */
    SMALL = '1.0',
    /**
     * A medium version (56px x 56px) is available.
     */
    MEDIUM = '2.0',
    /**
     * A large version (112px x 112px) is available.
     */
    LARGE = '3.0'
}

/**
 * Represents an individual Twitch Emote's Data
 * 
 * Based on responses from https://dev.twitch.tv/docs/api/reference/#get-emote-sets
 */
export interface TwitchEmote {
    /**
     * Identifier from Twitch for the emote
     */
    id: string;
    /**
     * Human readable name for the emote
     * 
     * Is also what is entered into Chat to see the emote
     */
    name: string;
    /**
     * URLs available for this image
     */
    images: TwitchEmoteImages,
    /**
     * The type of emote.  Only exists for emotes from an emote set (not Global)
     */
    emote_type?: TWITCH_EMOTE_TYPES;
    /**
     * An ID that identifies the emote set that the emote belongs to.
     */
    emote_set_id?: string;
    /**
     * The ID of the broadcaster who owns the emote.
     */
    owner_id?: string;
    /**
     * The formats that the emote is available in. For example, if the emote is available only as a static PNG, the array contains only `static`. But if the emote is available as a static PNG and an animated GIF, the array contains `static` and `animated`.
     */
    format: Array<TWITCH_EMOTE_FORMATS> | TWITCH_EMOTE_FORMATS;
    /**
     * The sizes that the emote is available in. For example, if the emote is available in small and medium sizes, the array contains 1.0 and 2.0.
     */
    scale: Array<TWITCH_EMOTE_SCALE> | TWITCH_EMOTE_SCALE;
    /**
     * The background themes that the emote is available in.
     */
    theme_mode: Array<TWITCH_THEMES> | TWITCH_THEMES;
    /**
     * A templated URL. Use the values from the id, format, scale, and theme_mode fields to replace the like-named placeholder strings in the templated URL to create a CDN (content delivery network) URL that you use to fetch the emote.
     */
    template: string;
}

/**
 * Represents an entry inside a component's `emoteMap`
 */
export interface EmoteMapItem {
    /**
     * Identifier for the Twitch Emote
     */
    id: string;
    /**
     * The formats that the emote is available in.
     */
    format: Array<TWITCH_EMOTE_FORMATS>;
    /**
     * The sizes that the emote is available in.
     */
    scale: Array<TWITCH_EMOTE_SCALE>;
    /**
     * The background themes that the emote is available in.
     */
    theme_mode: Array<TWITCH_THEMES>;
    /**
     * A templated URL for the image.
     */
    template: string;
}