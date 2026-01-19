import { BelaboxNetif, BelaboxSensors } from "./interface";

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
