// Share your computer with factions to increase reputation earned

/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		await ns.share();
	}
}