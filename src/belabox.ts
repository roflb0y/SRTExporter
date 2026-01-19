import { BelaboxNetif, BelaboxSensors } from "./interface";

export class BelaboxStats {
    sensors: BelaboxSensors | undefined;
    netif: BelaboxNetif | undefined;

    constructor() {
        this.sensors;
        this.netif;
    }
}

export const belabox = new BelaboxStats();