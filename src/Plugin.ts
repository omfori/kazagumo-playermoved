import { Events, Kazagumo, KazagumoPlugin as Plugin } from "kazagumo";
import { Client, JSONVoiceState, Member } from "oceanic.js";

export class KazagumoPlugin extends Plugin {
    /**
     * Kazagumo instance.
     */
    public kazagumo: Kazagumo | null = null;

    /**
     * Initialize the plugin.
     * @param client Discord.Client
     */
    constructor(public client: Client) {
        super();
    }

    /**
     * Load the plugin.
     * @param kazagumo Kazagumo
     */
    public load(kazagumo: Kazagumo): void {
        this.kazagumo = kazagumo;
        this.client.on("voiceStateUpdate", this.onVoiceStateUpdate.bind(this));
    }

    /**
     * Unload the plugin.
     */
    public unload(): void {
        this.client.removeListener(
            "voiceStateUpdate",
            this.onVoiceStateUpdate.bind(this)
        );
        this.kazagumo = null;
    }

    private onVoiceStateUpdate(
        member: Member,
        oldState: JSONVoiceState | null
    ): void {
        if (!this.kazagumo || member.id !== this.client.user.id) return;

        const newChannelId = member.voiceState?.channelID;
        const oldChannelId = oldState?.channelID;
        const guildId = member.guildID;

        const player = this.kazagumo.players.get(guildId);
        if (!player) return;

        let state = "UNKNOWN";
        if (!oldChannelId && newChannelId) state = "JOINED";
        else if (oldChannelId && !newChannelId) state = "LEFT";
        else if (oldChannelId && newChannelId && oldChannelId !== newChannelId)
            state = "MOVED";

        if (state === "UNKNOWN") return;

        this.kazagumo.emit(Events.PlayerMoved, player, state, {
            oldChannelId,
            newChannelId,
        });
    }
}
