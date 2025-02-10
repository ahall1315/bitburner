// Library for bitburner scripts. All exported functions must have ns as a parameter.

import * as constants from "/lib/const.js";

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    ns.tprint("This script functions as a library which stores utilities for other scripts.");
}

/** @param {import("@ns").NS} ns **/
export function getRandomInt(ns, min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

/** @param {import("@ns").NS} ns **/
export function getNumOwnedPortPrograms(ns) {
    let count = 0;

    for (let i = 0; i < constants.portPrograms.length; i++) {
        if (ns.fileExists(constants.portPrograms[i], "home")) {
            count++;
        }
    }

    return count;
}

/** @param {import("@ns").NS} ns **/
// Get the ratio between player's karma and the gang requirement as a percentage
export function getKarmaRatio(ns) {
    let karma = ns.heart.break();

    return (karma / constants.gangKarmaRequirement);
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
 * Gets the free RAM of the target host
 * 
 * @returns the amount of RAM that is free on a given host
*/
/** @param {import("@ns").NS} ns **/
export function getFreeRAM(ns, host) {
    return (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
}

/**
 * Gets the maximum amount of threads that can be used for a given host and script
 * The amount of threads calculated is based on the free RAM of the host
 * 
 * @returns maximum threads for given host and script RAM
*/
/** @param {import("@ns").NS} ns **/
export function getMaxThreads(ns, host, script) {
    return Math.floor(getFreeRAM(ns, host) / ns.getScriptRam(script, host))
}

/**
 * Formats RAM
 * 
 * @deprecated
 * Deprecated as of v2.2.2. Use ns.formatRAM.
 * 
 * @returns Formatted RAM
*/
/** @param {import("@ns").NS} ns **/
export function formatRAM(ns, n) {
    if (isNaN(n)) {
        return "NaN";
    }
    return ns.nFormat(n * constants.gigaMultiplier, "0.00b");
}

/**
 * Averages a given array of numbers
 * 
 * @returns The average of the given array of numbers
 */
/** @param {import("@ns").NS} ns **/
export function getAverage(ns, array) {
    if (!Array.isArray(array)) {
        if (!isNaN(array)) {
            return array;
        }
        return NaN;
    }

    let avg = array.reduce((p, c, _, a) => p + c / a.length, 0);
    return avg;
}

/**
 * Takes a number and adds commas to it
 * 
 * @param x The number to add commas to
 * 
 * @returns A string with commas for every 3 digits
 */
/** @param {import("@ns").NS} ns **/
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}