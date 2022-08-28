// Experiment with gang api

/** @param {NS} ns */
export async function main(ns) {
    const namesPath = "/misc/gang_member_names.txt";
    let memberNames = [];

    if (ns.fileExists(namesPath)) {
        memberNames = ns.read(namesPath)
    } else {
        ns.tprint("File " + namesPath + " does not exist! Cannot run script.");
        ns.exit();
    }

    ns.tprint(memberNames);
}