// Prints the current share power of all active share calls

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
	ns.tprint("Current share multiplier is: " + ns.getSharePower())
}