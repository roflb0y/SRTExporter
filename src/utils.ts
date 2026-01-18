import { SensorsI } from "./interface";

export function parseSensors(data: any): SensorsI {
    let res: SensorsI = { temp: Number(data["SoC temperature"].split(" ")[0]) };
    if (data["RTMP ingest - live"])
        res.rtmpIngest = Number(data["RTMP ingest - live"].split(" ")[0]);
    return res;
}