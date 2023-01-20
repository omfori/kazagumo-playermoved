"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KazagumoPlugin = void 0;
const kazagumo_1 = require("kazagumo");
class KazagumoPlugin extends kazagumo_1.KazagumoPlugin {
    client;
    /**
     * Kazagumo instance.
     */
    kazagumo = null;
    /**
     * Initialize the plugin.
     * @param client Discord.Client
     */
    constructor(client) {
        super();
        this.client = client;
    }
    /**
     * Load the plugin.
     * @param kazagumo Kazagumo
     */
    load(kazagumo) {
        this.kazagumo = kazagumo;
        this.client.on("voiceStateUpdate", this.onVoiceStateUpdate.bind(this));
    }
    /**
     * Unload the plugin.
     */
    unload() {
        this.client.removeListener("voiceStateUpdate", this.onVoiceStateUpdate.bind(this));
        this.kazagumo = null;
    }
    onVoiceStateUpdate(member, oldState) {
        if (!this.kazagumo || member.id !== this.client.user.id)
            return;
        console.log(member.voiceState)
        if (member.voiceState === null)
            throw Error("<Member>.voiceState is null");
        if (oldState === null)
            throw Error("oldState (<JSONVoiceState>) is null");
        const newChannelId = member.voiceState.channelID;
        const oldChannelId = oldState.channelID;
        const guildId = member.guildID;
        const player = this.kazagumo.players.get(guildId);
        if (!player)
            return;
        let state = "UNKNOWN";
        if (!oldChannelId && newChannelId)
            state = "JOINED";
        else if (oldChannelId && !newChannelId)
            state = "LEFT";
        else if (oldChannelId && newChannelId && oldChannelId !== newChannelId)
            state = "MOVED";
        if (state === "UNKNOWN")
            return;
        this.kazagumo.emit(kazagumo_1.Events.PlayerMoved, player, state, {
            oldChannelId,
            newChannelId,
        });
    }
}
exports.KazagumoPlugin = KazagumoPlugin;
