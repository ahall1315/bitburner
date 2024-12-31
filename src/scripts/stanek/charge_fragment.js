import { getThreads } from "/lib/utils";

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    let maxThreads = -1;
    let fragments = [];

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

        maxThreads = getThreads(ns, ns.getServerMaxRam(ns.getHostname()), ns.getScriptRam(ns.getScriptName()));
        if (maxThreads !== 1) {
            ns.run(ns.getScriptName(), (maxThreads - 1));
        }

    }

    while (true) {{
        try {
            fragments = ns.stanek.activeFragments();
        } catch (error) {
            ns.print("ERROR " + error);
            return;
        }

        for (let i = 0; i < fragments.length; i++) {
            if (fragments[i].limit === 99) {
                fragments[i].isBooster = true;
            } else {
                fragments[i].isBooster = false;
            }

            if (!fragments[i].isBooster) {
                try {
                    await ns.stanek.chargeFragment(fragments[i].x, fragments[i].y);
                } catch (error) {
                    ns.print("ERROR " + error);
                    return;
                }
            }
        }
    }}
}