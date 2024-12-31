/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length !== 1) {
        ns.tprintf("Hacks a server one time.");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [target]`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    let target = args._[0];

    await ns.hack(target);
}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
}