/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let bn = ns.args[0];
    let confirm = false;

    if (bn === undefined) {
        ns.tprint("WARN Incorrect usage. Please provide the [number] of the bitnode to jump to.");
    } else {
        confirm = await ns.prompt("Are you sure you want to destroy w0r1d_d43m0n and jump to BN" + bn + "?");

        if (confirm) {
            ns.singularity.destroyW0r1dD43m0n(bn);
        }

    }

}