// Prints the current share power of all active share calls

/** @param {NS} ns */
export async function main(ns) {
	ns.tprint("Current share multiplier is: " + ns.getSharePower())
}