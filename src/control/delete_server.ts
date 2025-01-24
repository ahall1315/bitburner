// Deletes the provided purchased server

import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
	if (ns.args[0] === "help") {
		ns.tprintf("Deletes the provided purchased server");
		ns.tprintf(`Usage: run ${ns.getScriptName()} [target]`);
		ns.tprintf("Example:");
		ns.tprintf(`> run ${ns.getScriptName()} golem0`);
		ns.exit();
	}

	let target = ns.args[0] as string | undefined; 

	if (typeof target !== "string") {
		ns.tprint("Incorrect usage of delete. Correct usage: delete [hostname]")
	} else {
		ns.deleteServer(target);
	}
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
	return [...data.servers];
}