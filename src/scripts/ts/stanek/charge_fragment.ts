import { NS, AutocompleteData, ActiveFragment } from "@ns";
import { getThreads } from "/lib/utils.js";

export async function main(ns: NS): Promise<void> {
    let maxThreads: number = -1;
    let fragments: ActiveFragment[] = [];

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

    while (true) {
        try {
            fragments = ns.stanek.activeFragments();
        } catch (error) {
            ns.print("ERROR " + error);
            return;
        }

        for (let i = 0; i < fragments.length; i++) {
            try {
                await ns.stanek.chargeFragment(fragments[i].x, fragments[i].y);
            } catch (error) {
                ns.print("ERROR " + error);
                return;
            }
        }
    }
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return [...data.servers, ...data.scripts, ...data.txts, "help", "--help"];
}