import { getConfig } from "./config";

import axios, { AxiosResponse } from "axios";
import { SRTStream, SRTStreamIds } from "./interface";
import { log } from ".";

let config = getConfig();
//console.log(config);

async function sendApiRequest<T>(url: string): Promise<AxiosResponse<T>> {
    config = getConfig();
    return axios.get(config.BASE_URL + url, {
        timeout: 2000,
        headers: { Authorization: "Bearer " + config.API_KEY },
    });
}

export async function getStreamData(streamId: string): Promise<SRTStream> {
    log(`getting /stats/${streamId}`);
    const res = await sendApiRequest<SRTStream>("/stats/" + streamId);

    console.log(res.data);
    if (res.data.status !== "ok") throw new Error(`${streamId} status not ok`);

    return res.data;
}

export async function getStreamIDS(): Promise<SRTStreamIds> {
    log("getting /api/stream-ids");
    const res = await sendApiRequest<SRTStreamIds>("/api/stream-ids");

    console.log(res.data);
    if (!res.data) throw new Error("stream ids undefined");

    return res.data;
}
