// Displays a cat picture
// Code modified from https://steamcommunity.com/sharedfiles/filedetails/?id=2683674829

import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    // Gets the directory of this script
    const scriptDir = ((p) => p ? p + "/" : "/")(ns.getScriptName().split("/").slice(0, -1).join("/"));

    await ns.wget("https://api.thecatapi.com/v1/images/search", scriptDir + "cat.txt");
    var content = await ns.read(scriptDir + "cat.txt");
    var imageJSON = JSON.parse(content)[0];
    var aspectRatio = imageJSON.width / imageJSON.height;
    if (imageJSON.height > 570) {
        imageJSON.height = 570;
        imageJSON.width = imageJSON.height * aspectRatio;
    } else if (imageJSON.width > 1024) {
        imageJSON.width = 1024;
        imageJSON.height = imageJSON.width / aspectRatio;
    }
    var imageHTML = `<img src=\"${imageJSON.url}\" width=${imageJSON.width} height=${imageJSON.height}></img>`;
    ns.alert(imageHTML);
}