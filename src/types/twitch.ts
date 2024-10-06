/**
 * From https://dev.twitch.tv/docs/extensions/reference/#helper-extensions
 */
export interface TwitchExtensionAuth {
    /**
     * Channel ID of the page where the extension is iframe embedded.
     */
    channelId: string;
    /**
     * Client ID of the extension.
     */
    clientId: string;
    /**
     * JWT that should be passed to any EBS call for authentication.
     */
    token: string;
    /**
     * JWT that can be used for front end API requests
     */
    helixToken: string;
    /**
     * Opaque user ID.
     */
    userId: string;
}

interface TwitchExtensionContextHostringInfo {
    /**
     * Numeric ID of the channel being hosted by the currently visible channel
     */
    hostedChannelId: string;
    /**
     * Numeric ID of the host channel
     */
    hostingChannelId: string;
}

export interface TwitchExtensionContext {
    /**
     * If true, player controls are visible (e.g., due to mouseover). Do not use this for mobile extensions; it is not sent for mobile.
     */
    arePlayerControlsVisible: boolean;
    /**
     * Bitrate of the broadcast.
     */
    bitrate: number;
    /**
     * Buffer size of the broadcast.
     */
    bufferSize: number;
    /**
     * Display size of the player.
     */
    displayResolution: string;
    /**
     * Game being broadcast.
     */
    game: string;
    /**
     * Number of seconds of latency between the broadcaster and viewer.
     */
    hlsLatencyBroadcaster: number;
    /**
     * Information about the current channel’s hosting status, or undefined if the channel is not currently hosting.
     * 
     * Host mode enables broadcasters to stream another channel’s live broadcast (audio, video, and Extensions), while the host broadcaster is offline or interacting only with chat.
     */
    hostingInfo: TwitchExtensionContextHostringInfo;
    /**
     * If true, the viewer is watching in fullscreen mode. Do not use this for mobile extensions; it is not sent for mobile.
     */
    isFullScreen: boolean;
    /**
     * If true, the viewer has muted the stream.
     */
    isMuted: boolean;
    /**
     * If true, the viewer has paused the stream.
     */
    isPaused: boolean;
    /**
     * If true, the viewer is watching in theater mode. Do not use this for mobile extensions; it is not sent for mobile.
     */
    isTheatreMode: boolean;
    /**
     * Language of the broadcast (e.g., "en").
     */
    language: string;
    /**
     * Indicates how the stream is being played. Valid values:
     *   
     *   - video — Normal video playback.
     * 
     *   - audio — Audio-only mode. Applies only to mobile apps.
     * 
     *   - remote — Using a remote display device (e.g., Chromecast). Video statistics may be incorrect or unavailable.
     * 
     *   - chat-only — No video or audio, chat only. Applies only to mobile apps. Video statistics may be incorrect or unavailable.
     */
    mode: string;
    /**
     * The user’s theme setting on the Twitch website. Valid values: "light" or "dark".
     */
    theme: string;
    /**
     * Resolution of the broadcast.
     */
    videoResolution: string;
    /**
     * Currently selected player volume. Valid values: between 0 and 1.
     */
    volume: number;
}

/**
 * The themes supported by Twitch
 * 
 * See https://dev.twitch.tv/docs/api/reference/#get-emote-sets -> `Response Body` -> `theme_mode` for reference.
 */
export enum TWITCH_THEMES {
    LIGHT = 'light',
    DARK = 'dark'
}