// Library for bitburner scripts. All exported functions must have ns as a parameter.

import * as constants from "lib/const.js";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    ns.tprint("This script functions as a library which stores utilities for other scripts.");
}

/** @param {import("NetscriptDefinitions").NS} ns */
export function getRandomInt(ns, min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

/** @param {import("NetscriptDefinitions").NS} ns */
export function getNumOwnedPortPrograms(ns) {
    let count = 0;

    for (let i = 0; i < constants.portPrograms.length; i++) {
        if (ns.fileExists(constants.portPrograms[i], "home")) {
            count++;
        }
    }

    return count;
}

/** @param {import("NetscriptDefinitions").NS} ns */
// Get the ratio between player's karma and the gang requirement as a percentage
export function getKarmaRatio(ns) {
    let karma = ns.heart.break();

    return ((karma.toFixed(0) / constants.gangKarmaRequirement) * 100).toFixed(0);
}

/**
 * Gets threads for a given host RAM and script RAM
 * 
 * @returns threads for given host RAM and script RAM
*/
export function getThreads(ns, hostRam, scriptRam) {
    return Math.floor(hostRam / scriptRam);
}

/**
 * Formats RAM
 * 
 * @returns Formatted RAM
*/
export function formatRAM(ns, n) {
    return ns.nFormat(n * constants.gigaMultiplier, "0.00b");
}