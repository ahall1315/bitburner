/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let money = 0;

    while (true) {
        money += await ns.singularity.manualHack();
        ns.print("Manual hack has made: " + ns.formatNumber(money));
    }
}