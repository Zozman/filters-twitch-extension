import { createServer } from "miragejs";

import globalEmotesResponse from "./globalEmotes.json";
import twitchTurboEmotesResponse from "./twitchTurboEmotes.json";

/**
 * Function to setup a Mock API server for local development
 * @returns Setup of the mock server
 */
export function setupMockDevServer() {
    return createServer({
        routes() {
            // Mock global emotes response
            this.get('https://api.twitch.tv/helix/chat/emotes/global', () => globalEmotesResponse);
            // Mock emote set with Twitch Turbo emote set
            this.get('https://api.twitch.tv/helix/chat/emotes/set', () => twitchTurboEmotesResponse);
            // Allow anything not explicitly mocked to work as normal
            // Otherwise local assets like SVGs won't work
            this.passthrough();
        }
    });
};