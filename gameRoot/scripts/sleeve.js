// Experiment with sleeves API

/** @param {NS} ns */
export async function main(ns) {
    ns.tprintf(JSON.stringify(ns.sleeve.getInformation(0), null, 1));
}