/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false], ["target", ""]]);
    const script = args._[0];

    if (args.help || script === undefined) {
        ns.tprint("This script will kill all scripts with a given filename. Must be full pathname.");
        ns.tprint("An optional target server may be provided to kill scripts on.")
        ns.tprint(`USAGE: run ${ns.getScriptName()} [SCRIPT NAME] --target [TARGET SERVER]`);
        ns.tprint("Example 1:");
        ns.tprint(`> run ${ns.getScriptName()} hack.js`);
        ns.tprint("Example 2:");
        ns.tprint(`> run ${ns.getScriptName()} hack.js --target n00dles`);
        return;
    }

    if (args.target === "") {
        if (!ns.scriptKill(script, ns.getHostname())) {
            ns.tprint("ERROR Failed to kill one or more scripts");
        }
    } else {
        if (!ns.scriptKill(script, args.target)) {
            ns.tprint("ERROR Failed to kill one or more scripts");
        }
    }
}