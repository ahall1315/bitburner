// Moves all script files in a source directory to a server

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let hostname = ns.getHostname();
	let sourceDirectory = ns.args[0];
	let target = ns.args[1];
	let copied = false;

	if (sourceDirectory == undefined || target == undefined) {
		ns.tprint("Incorrect usage of copy script. Usage: copy [source directory] [destination hostname]");
	} else {
		let files = ns.ls(hostname, sourceDirectory);
		files.forEach(function (file, index) {
			copied = ns.scp(file, target);
			if (copied) {
				ns.print("Successfully copied " + file + " to " + target);
			} else {
				ns.print("Failed to copy " + file + " to " + target + ". Is there enough RAM?");
			}
		})
		return copied;
	}
}