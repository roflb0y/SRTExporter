export interface SRTStreamId {
    player: string,
    publisher: string
}

export interface SRTStreamIds {
    data: SRTStreamId[]
    status: string
}

export interface SRTPublisher {
    bitrate: number,
    buffer: number,
    dropped_pkts: number,
    latency: number,
    rtt: number,
    uptime: number
}

export interface SRTStream {
    publisher?: SRTPublisher,
    message?: string,
    status: string
}

export interface SRTStreams {
    [streamid: string]: SRTStream
}

export interface Config {
    BASE_URL: string;
    API_KEY: string;
    updateInterval: number;
}

export interface NetifI {
    [network: string]: {
        ip: string,
        tp: number,
        enabled: boolean,
        error?: string
    }
}

export interface SensorsI {
    rtmpIngest?: number
    temp: number
}