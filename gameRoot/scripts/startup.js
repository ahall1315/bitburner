// Runs scripts to be used after installing augmentations

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let pid = -1;

    ns.run("/scripts/custom_stats.js");

    pid = ns.run("/scripts/buy_programs.js");

    while(ns.isRunning(pid)) {
        ns.print("Waiting for script with pid " + pid + "to stop running");
        await ns.sleep(500);
    }
    pid = -1; // Reset pid

    ns.run("/scripts/assign_sleeves.js");

    ns.run("/scripts/hack_all.js", 1, "--killHack");
}