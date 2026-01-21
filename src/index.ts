import { Registry, Gauge } from "prom-client";
import Koa from "koa";
import Router from "@koa/router";
import { bodyParser } from "@koa/bodyparser";

import { Updater } from "./updater";
import { belabox } from "./belabox";
import { getConfig } from "./config";

const config = getConfig();

const register = new Registry();
const app = new Koa();
const router = new Router();

app.use(bodyParser());

export const log = (msg: any) => {
    console.log(`${new Date().toLocaleString()} | ${msg}`);
};

const srtStreamBitrate = new Gauge({
    name: "srt_bitrate",
    help: "srt stream bitrate",
    labelNames: ["streamid"],
});
register.registerMetric(srtStreamBitrate);

const srtStreamDroppedPkts = new Gauge({
    name: "srt_dropped",
    help: "srt stream dropped packets",
    labelNames: ["streamid"],
});
register.registerMetric(srtStreamDroppedPkts);

const srtStreamRTT = new Gauge({
    name: "srt_rtt",
    help: "srt stream rtt",
    labelNames: ["streamid"],
});
register.registerMetric(srtStreamRTT);

const belaboxSensors = new Gauge({
    name: "belabox_sensors",
    help: "belabox sensors data",
    labelNames: ["type"],
});
register.registerMetric(belaboxSensors);

const belaboxNetifBitrate = new Gauge({
    name: "belabox_netif",
    help: "belabox net data",
    labelNames: ["name"],
});
register.registerMetric(belaboxNetifBitrate);

const belaboxMaxBitrate = new Gauge({
    name: "belabox_max_br",
    help: "belabox max br",
});
register.registerMetric(belaboxMaxBitrate);

const updater = new Updater();
updater.start();

router.get("/metrics", async (ctx) => {
    if (!updater.streamids) return (ctx.status = 503);

    for (const item of updater.streamids.data) {
        const stream = updater.streams[item.player];
        if (!stream) continue;

        //console.log(`setting ${JSON.stringify(stream)}`);
        srtStreamBitrate
            .labels(item.player)
            .set(stream.publisher?.bitrate ?? 0);
        srtStreamRTT.labels(item.player).set(stream.publisher?.rtt ?? 0);
        srtStreamDroppedPkts
            .labels(item.player)
            .set(stream.publisher?.dropped_pkts ?? 0);
    }

    belaboxNetifBitrate.reset();
    if (belabox.netif) {
        for (const item of Object.keys(belabox.netif)) {
            belaboxNetifBitrate
                .labels(item)
                .set(Math.round((belabox.netif[item].tp * 8) / 1024));
        }
    }

    belaboxMaxBitrate.reset();
    if (belabox.maxBitrate) belaboxMaxBitrate.set(belabox.maxBitrate);

    belaboxSensors.labels("temp").set(belabox.sensors?.temp ?? 0);
    belaboxSensors.labels("rtmpIngest").set(belabox.sensors?.rtmpIngest ?? 0);

    return (ctx.body = await register.metrics());
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx, next) => {
    log(`${ctx.method} ${ctx.path} | ${ctx.ip}`);
    await next();
});

log("Starting server");

app.listen(config.METRICS_PORT, () => {
    log(`Listening on ${config.METRICS_PORT}`);
});
