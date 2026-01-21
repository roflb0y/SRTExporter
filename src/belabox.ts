import { WebSocketServer } from "ws";
import { BelaboxNetif, BelaboxSensors } from "./interface";
import { getConfig } from "./config";
import { log } from ".";
import { parseSensors } from "./utils";

const config = getConfig();
// yes we're reading the config file like 5 times during launch
// this is ass but i dont care

let belaboxTimeout: NodeJS.Timeout;

export class BelaboxStats {
    sensors: BelaboxSensors | undefined;
    netif: BelaboxNetif | undefined;
    maxBitrate: number | undefined;

    constructor() {
        this.sensors;
        this.netif;
        this.maxBitrate;
    }
}

export const belabox = new BelaboxStats();

const wss = new WebSocketServer({ port: config.WS_PORT, path: "/ws" }, () => {
    log(`Started WS server on port ${config.WS_PORT}`);
});

wss.on("connection", (ws) => {
    log("New WS connection");

    ws.on("message", (data) => {
        const dataString = data.toString("utf-8");
        const d = JSON.parse(dataString);
        //log(`got belabox message: ${dataString}`);

        if (d.netif) {
            belabox.netif = d.netif as BelaboxNetif;
        }

        if (d.sensors) {
            const sensors = parseSensors(d.sensors);
            belabox.sensors = sensors;
        }

        if (d.bitrate?.max_br) {
            belabox.maxBitrate = d.bitrate.max_br;
        }

        if (d.config?.max_br) {
            log("Received BELABOX config")
            belabox.maxBitrate = d.config.max_br;
        }

        clearTimeout(belaboxTimeout);
        belaboxTimeout = setTimeout(() => {
            belabox.sensors = undefined;
            belabox.netif = undefined;
            belabox.maxBitrate = undefined;
            log("reset belabox data after 10s");
        }, 10000);
    });

    ws.on("close", () => {
        log("WS connection closed");
    });
});
