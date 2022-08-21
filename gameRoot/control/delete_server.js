// Deletes the provided purchased server

/** @param {NS} ns */
export async function main(ns) {
	target = args[0];

	if (target == undefined) {
		ns.tprint("Incorrect usage of delete. Correct usage: delete [hostname]")
	} else {
		ns.deleteServer(target);
	}
}