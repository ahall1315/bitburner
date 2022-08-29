// Experiment with hacknet api

/** @param {NS} ns */
export async function main(ns) {
    let nodeStats = ns.hacknet.getNodeStats(0);

    ns.tprint(JSON.stringify(nodeStats, null, 2));

    ns.hacknet.purchaseNode();
}