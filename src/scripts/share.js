// Share your computer with factions to increase reputation earned

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
	while (true) {
		await ns.share();
	}
}