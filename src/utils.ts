import { BelaboxSensors } from "./interface";

export function parseSensors(data: any): BelaboxSensors {
    let res: BelaboxSensors = { temp: Number(data["SoC temperature"].split(" ")[0]) };
    if (data["RTMP ingest - live"])
        res.rtmpIngest = Number(data["RTMP ingest - live"].split(" ")[0]);
    return res;
}