// Attempts to grant root access and distribute scripts to a provided server

import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
    let target: string = <string>ns.args[0];
    let pid: number = -1;
    let error: boolean = false;
    const noPrintSwitch: string = "-n";
    let match: boolean = false;
    const substring: string = "scripts";

    const args = ns.flags([["help", false]]);
    if (ns.args[0] === "help" || args.help) {
        ns.tprintf("Attempts to grant root access and distribute scripts to a provided server");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [target]`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} n00dles`);
        ns.exit();
    }

    if (target == undefined) {
        ns.tprint("Incorrect usage of arguments. Provide [hostname] of targeted server.");
        ns.exit();
    }

    ns.tprint("Attempting to take over " + target + ".");

    pid = ns.run("/scripts/ts/open_ports.js", 1, target, noPrintSwitch);
    await ns.sleep(250);

    if (pid === 0 || !ns.hasRootAccess(target)) {
        ns.tprint("Not enough ports open on " + target + ".");
        error = true;
    } else {
        ns.tprint("Root access granted on " + target + ".");
    }

    pid = ns.run("/scripts/ts/scp.js", 1, "/lib/", target);
    pid = ns.run("/scripts/ts/scp.js", 1, "/scripts/", target);
    await ns.sleep(250);

    // Searches the server's files for the substring 'scripts'
    if (typeof ns.ls(target).find(element => {
        if (element.includes(substring)) {
            return true;
        } else
            return false;
    }) === "string") {
        match = true;
    } else {
        match = false;
    }

    if (pid === 0 || !match) {
        ns.tprint("No scripts found on " + target + ".");
        error = true;
    } else {
        ns.tprint("Scripts found on " + target + ".");
    }

    if (!error) {
        ns.tprint("Successfully took over " + target + ".");
    } else {
        ns.tprint("Failed to take over " + target + ".");
    }
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return [...data.servers, "help", "--help"];
}