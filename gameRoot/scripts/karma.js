// Prints the player's karma to the terminal

/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("Karma level: " + ns.heart.break().toFixed(0));
}