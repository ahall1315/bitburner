// Original from: https://github.com/bitburner-official/bitburner-scripts/blob/master/custom-stats.js

import { getKarmaRatio } from "lib/utils.js";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    ns.atExit(() => { hook0.innerHTML = ""; hook1.innerHTML = ""; });
    
    const doc = eval("document");
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');
    const hook2 = doc.getElementById('overview-extra-hook-1');
    while (true) {
        try {
            const headers = []
            const values = [];
            // Add player's current karma
            headers.push("Karma");
            values.push(ns.nFormat(ns.heart.break(), "0,0") + ` (${getKarmaRatio(ns)}%)`);
            // Add script income per second
            headers.push("ScrInc");
            values.push(ns.nFormat(ns.getTotalScriptIncome()[0], "$0.000a") + '/sec');
            // Add script exp gain rate per second
            headers.push("ScrExp");
            values.push(ns.nFormat(ns.getTotalScriptExpGain(), "0.000a") + '/sec');
            // TODO: Add more neat stuff

            // Now drop it into the placeholder elements
            hook0.innerText = headers.join("\n");
            hook1.innerText = values.join("\n");
            hook2.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
    
}
