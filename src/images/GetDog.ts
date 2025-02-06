// Displays a random dog picture
// Code modified from https://steamcommunity.com/sharedfiles/filedetails/?id=2683674829

import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
    // Gets the directory of this script
    const scriptDir = ((p) => p ? p + "/" : "/")(ns.getScriptName().split("/").slice(0, -1).join("/"));

    if (!await ns.wget("https://dog.ceo/api/breeds/image/random", scriptDir + "dog.txt")) {
        ns.tprintf("ERROR Failed to fetch the image from the web. Are you connected to the internet?");
        ns.exit();
    }

    let content = ns.read(scriptDir + "dog.txt");
    let imageJSON = JSON.parse(content);

    ns.alert(`<img src=\"${imageJSON.message}\" style="max-width: 1024px; max-height: 570px;"></img>`);
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return ["help", "--help"];
}