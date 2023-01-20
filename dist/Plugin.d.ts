import { Kazagumo, KazagumoPlugin as Plugin } from "kazagumo";
import { Client } from "oceanic.js";
export declare class KazagumoPlugin extends Plugin {
    client: Client;
    /**
     * Kazagumo instance.
     */
    kazagumo: Kazagumo | null;
    /**
     * Initialize the plugin.
     * @param client Discord.Client
     */
    constructor(client: Client);
    /**
     * Load the plugin.
     * @param kazagumo Kazagumo
     */
    load(kazagumo: Kazagumo): void;
    /**
     * Unload the plugin.
     */
    unload(): void;
    private onVoiceStateUpdate;
}
