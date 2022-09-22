// Prints the player's karma to the terminal (Requirement to start gang: -54,000)

/** @param {NS} ns */
export async function main(ns) {
    const gangRequirement = -54000;
    let karma = ns.heart.break();

    ns.tprint("Karma level: " + karma.toFixed(0) + " (" + ((karma / gangRequirement) * 100).toFixed(2) + "% of gang requirement)");
}