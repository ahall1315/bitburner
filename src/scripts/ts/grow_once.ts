import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
    if (ns.args[0] === "help" || ns.args.length !== 1) {
        ns.tprintf("Grows a server one time.");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [target]`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} n00dles`);
        ns.exit();
    }

    let target: string = <string>ns.args[0];
    await ns.grow(target);
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return [...data.servers];
}