// Prints the player's karma to the terminal (Requirement to start gang: -54,000)
// Karma persists between soft resets

import { gangKarmaRequirement } from "./lib/const.js";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let karma = ns.heart.break();

    ns.tprint("Karma level: " + ns.formatNumber(karma.toFixed(0), 0, 1000, true) + " (" + ((karma / gangKarmaRequirement) * 100).toFixed(2) + "% of gang requirement)");
}