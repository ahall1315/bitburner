// Displays a random cat picture
// Code modified from https://steamcommunity.com/sharedfiles/filedetails/?id=2683674829

import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
    // Gets the directory of this script
    const scriptDir = ((p) => p ? p + "/" : "/")(ns.getScriptName().split("/").slice(0, -1).join("/"));

    if (!await ns.wget("https://api.thecatapi.com/v1/images/search", scriptDir + "cat.txt")) {
        ns.tprintf("ERROR Failed to fetch the image from the web. Are you connected to the internet?");
        ns.exit();
    }

    let content = ns.read(scriptDir + "cat.txt");
    let imageJSON = JSON.parse(content)[0];

    ns.alert(`<img src=\"${imageJSON.url}\" style="max-width: 1024px; max-height: 570px;"></img>`);
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return ["help", "--help"];
}