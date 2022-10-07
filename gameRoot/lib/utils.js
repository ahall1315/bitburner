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
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/** @param {import("NetscriptDefinitions").NS} ns */
export function getNumOwnedPortPrograms(ns) {
    let count = 0;

    for (let i = 0; i < constants.portPrograms.length; i++) {
        if (ns.fileExists(constants.portPrograms[i])) {
            count++;
        }
    }

    return count;
}