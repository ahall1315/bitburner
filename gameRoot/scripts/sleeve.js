// Experiment with sleeves API

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    ns.tprintf(JSON.stringify(ns.sleeve.getInformation(0), null, 1));
}