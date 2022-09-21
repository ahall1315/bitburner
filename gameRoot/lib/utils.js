// Library for bitburner scripts. All exported functions must have ns as a parameter.

/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("This script functions as a library which stores utilities for other scripts.");
}

/** @param {NS} ns */
export function getRandomInt(ns, min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}