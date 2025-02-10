// Original from: https://github.com/bitburner-official/bitburner-scripts/blob/master/custom-stats.js

import { NS, AutocompleteData } from "@ns";
import { getKarmaRatio } from "/lib/utils.js";

export async function main(ns: NS): Promise<void> {
    const args = ns.flags([["help", false]]);
        if (ns.args[0] === "help" || args.help) {
            ns.tprintf("This script will enhance your HUD (Heads up Display) with custom statistics.");
            ns.tprintf(`Usage: run ${ns.getScriptName()}`);
            ns.tprintf("Example:");
            ns.tprintf(`> run ${ns.getScriptName()}`);
            ns.exit();
        }
    
        ns.atExit(() => { hook0.innerHTML = ""; hook1.innerHTML = ""; });
        
        const doc: any = eval("document");
        const hook0: any = doc.getElementById('overview-extra-hook-0');
        const hook1: any = doc.getElementById('overview-extra-hook-1');
        const hook2: any = doc.getElementById('overview-extra-hook-1');
        
        while (true) {
            try {
                const headers = []
                const values = [];
                let karmaRatio = getKarmaRatio(ns);
                // Add player's current karma
                headers.push("Karma");
                if (karmaRatio < 1) {
                    values.push(ns.formatNumber(ns.heart.break(), 0, 1000, false) + ` (${ns.formatPercent(karmaRatio, 2)})`);
                } else {
                    values.push(ns.formatNumber(ns.heart.break(), 0, 1000, false) + ` (> 100%)`);
                }
                // Add script income per second
                headers.push("ScrInc");
                values.push("$" + ns.formatNumber(ns.getTotalScriptIncome()[0]) + '/sec');
                // Add script exp gain rate per second
                headers.push("ScrExp");
                values.push(ns.formatNumber(ns.getTotalScriptExpGain()) + '/sec');
    
                // Now drop it into the placeholder elements
                hook0.innerText = headers.join("\n");
                hook1.innerText = values.join("\n");
                hook2.innerText = values.join("\n");
            } catch (err) {
                ns.print("ERROR: Update Skipped: " + String(err));
            }
            await ns.sleep(1000);
        }
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return ["help", "--help"];
}