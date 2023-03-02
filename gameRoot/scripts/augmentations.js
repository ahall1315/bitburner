// Gets a list of unpurchased augmentations and writes it to a file
// You must have access to singularity functions to use this script

import { factionNames } from "./lib/const.js";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const augFile = "/data/unpurchased_augmentations.txt";
    let factions = [];
    let playerAugs = [];
    let data = "";

    class faction {
        constructor(name, augs) {
            this.name = name;
            this.augs = augs;
        }
    }

    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprintf("This script will get a list of unpurchased augmentations and print the list as well as write it to a file.");
        ns.tprintf("The file will be written to " + augFile);
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()}`);
        return;
    }

    playerAugs = ns.singularity.getOwnedAugmentations(true);

    playerAugs.filter

    for (let i = 0; i < factionNames.length; i++) {
        let unpurchasedAugs = ns.singularity.getAugmentationsFromFaction(factionNames[i]).filter(aug => !playerAugs.includes(aug));
        factions.push(new faction(factionNames[i], unpurchasedAugs));
    }

    data = JSON.stringify(factions, null, 1);
    ns.tprint(data);
    ns.tprint("Writing to " + augFile + "...");
    ns.write(augFile, data, "w");

}