import { parse } from "yaml";
import fs from "node:fs";
import { Config } from "./interface";

export function getConfig(): Config {
    return parse(fs.readFileSync("config.yml", { encoding: "utf-8" }));
}