import {
    clearIntervalAsync,
    setIntervalAsync,
    SetIntervalAsyncTimer,
} from "set-interval-async/dynamic";

import { SRTStreamIds, SRTStreams } from "./interface";
import * as net from "./net";
import { getConfig } from "./config";
import { log } from ".";

let config = getConfig();

export class Updater {
    streams: SRTStreams;
    streamids: SRTStreamIds | undefined;
    loop: SetIntervalAsyncTimer<[]> | undefined;

    constructor() {
        this.streams = {};
        this.streamids;
        this.loop = undefined;
    }

    async task() {
        try {
            const streamIDS = await net.getStreamIDS();
            this.streamids = streamIDS;

            let newStreams: SRTStreams = {};

            for (const item of streamIDS.data) {
                const stream = await net.getStreamData(item.player);
                newStreams[item.player] = stream;
            }

            this.streams = newStreams;
        } catch (e) {
            console.log(e);
        } finally {
            const newConfig = getConfig();
            if (newConfig.updateInterval !== config.updateInterval) {
                if (this.loop) clearIntervalAsync(this.loop);
                config = newConfig;
                this.start();

                log(`Dynamically updated interval: ${config.updateInterval}s`);
            } else {
                config = newConfig;
            }
        }
    }

    async start() {
        log("Starting updater loop");
        await this.task();
        this.loop = setIntervalAsync(
            this.task.bind(this),
            config.updateInterval * 1000
        );
    }

    async stop() {
        if (this.loop) {
            clearIntervalAsync(this.loop);
            this.loop = undefined;
        }
    }
}
