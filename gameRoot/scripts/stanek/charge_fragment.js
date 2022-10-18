import { getThreads } from "lib/utils";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false], ["max", false]]);

    if (args.help) {
        ns.tprintf("Charges active stanek fragments on a loop.");
        ns.tprintf("Optional argument --max to kill other scripts and run this script with max threads on this host.");
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example 1:");
        ns.tprintf(`> run ${ns.getScriptName()}`);
        ns.tprintf("Example 2:");
        ns.tprintf(`> run ${ns.getScriptName()} --max`);
        return;
    }

    if (args.max) {
        ns.tprint("Killing scripts...");
        ns.killall(ns.getHostname(), true);

        ns.run(ns.getScriptName(), (getThreads(ns, ns.getServerMaxRam(ns.getHostname()), ns.getScriptRam(ns.getScriptName()))) - 1);
    }

    while (true) {{
        let fragments = ns.stanek.activeFragments();

        for (let i = 0; i < fragments.length; i++) {
            if (fragments[i].limit === 99) {
                fragments[i].isBooster = true;
            } else {
                fragments[i].isBooster = false;
            }

            if (!fragments[i].isBooster) {
                await ns.stanek.chargeFragment(fragments[i].x, fragments[i].y);
            }
        }
    }}
}