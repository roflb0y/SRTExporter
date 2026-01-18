import { NetifI, SensorsI } from "./interface";

export class BelaboxStats {
    sensors: SensorsI | undefined;
    netif: NetifI | undefined;

    constructor() {
        this.sensors;
        this.netif;
    }
}

export const belabox = new BelaboxStats();