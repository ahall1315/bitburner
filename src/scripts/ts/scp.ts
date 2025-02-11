// Moves all script files in a source directory to a server

import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
    let hostname: string = ns.getHostname();
	let sourceDirectory: string = <string>ns.args[0];
	let target: string = <string>ns.args[1];
	let copied: boolean = false;

	const args = ns.flags([["help", false]]);
    if (ns.args[0] === "help" || args.help) {
        ns.tprintf("Moves all script files in a source directory to a server");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [source directory] [destination hostname]`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} scripts n00dles`);
        ns.exit();
    }

	if (sourceDirectory == undefined || target == undefined) {
		ns.tprint(`Incorrect usage of copy script. Usage: run ${ns.getScriptName()} [source directory] [destination hostname]`);
	} else {
		let files = ns.ls(hostname, sourceDirectory);
		files.forEach(function (file, index) {
			if (file.endsWith(".script") || file.endsWith(".js") || file.endsWith(".txt") || file.endsWith(".lit")) {
				copied = ns.scp(file, target);
			} else {
				ns.print("WARN Cannot copy files that are not scripts, .lit, or .txt files");
				ns.print("Attempted to copy file " + file + " from " + hostname + " to " + target);
			}
			if (copied) {
				ns.print("Successfully copied " + file + " to " + target);
			} else {
				ns.print("Failed to copy " + file + " to " + target + ". Is there enough RAM?");
			}
		})
	}
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return [...data.servers, ...data.scripts, ...data.txts, "help", "--help"];
}