import { getAverage } from "/lib/utils.js";

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false], ["train", false], ["equip", false]]);
    if (args.help) {
        ns.tprintf("This script will automatically ascend gang members.");
        ns.tprintf("Optional argument --train to assign gang members to train after ascending.");
        ns.tprintf("Optional argument --equip to buy equipment for the gang member after ascending.");
        return;
    }

    const ASC_MULT_THRESH = 2; // Ascension multiplier threshold
    const EQUIP_MEMBERS_PATH = "/scripts/equip_member.js";
    let currentMembers = [];
    let gangInfo = null;

    if (!ns.gang.inGang()) {
        ns.tprint("INFO You are not in a gang! You must join one before you can ascend gang members.");
        return;
    }

    ns.disableLog("ALL");

    while (true) {
        currentMembers = ns.gang.getMemberNames();
        gangInfo = ns.gang.getGangInformation();

        ns.print(`___________________________________________________
        Ascension Multiplier Threshold: ${ASC_MULT_THRESH}
        `);

        for (let i = 0; i < currentMembers.length; i++) {
            currentMembers[i] = ns.gang.getMemberInformation(currentMembers[i])
        }

        for (let i = 0; i < currentMembers.length; i++) {
            currentMembers[i].ascensionResult = ns.gang.getAscensionResult(currentMembers[i].name);

            if (currentMembers[i].ascensionResult === undefined) {
                ns.print(currentMembers[i].name + ": Cannot ascend");
                continue;
            }

            // If the gang member can ascend

            if (gangInfo.isHacking) {
                if (currentMembers[i].ascensionResult.hack >= ASC_MULT_THRESH) {
                    if (ns.gang.ascendMember(currentMembers[i].name) === undefined) {
                        ns.print("ERROR " + currentMembers[i].name + ": Failed to ascend gang member");
                    } else {
                        ns.print(currentMembers[i].name + ": Successfully ascended. They lost " + ns.formatNumber(currentMembers[i].ascensionResult.respect, 0) + " respect.");
                        if (args.train) {
                            if (currentMembers[i].task !== "Train Hacking") {
                                if (!ns.gang.setMemberTask(currentMembers[i].name, "Train Hacking")) {
                                    ns.print("ERROR " + currentMembers[i].name + ": Failed to assign to train hacking");
                                } else {
                                    ns.print(currentMembers[i].name + ": Assigned to train hacking");
                                }
                            }
                        }
                        if (ns.run(EQUIP_MEMBERS_PATH, 1, currentMembers[i].name, "-a") === 0) {
                            ns.print("ERROR " + currentMembers[i].name + ": Failed to run " + EQUIP_MEMBERS_PATH);
                        }
                    }
                } else {
                    ns.print(currentMembers[i].name + ": Can ascend. Multiplier is x" + ns.formatNumber(currentMembers[i].ascensionResult.hack, 5));
                }
            } else {
                // If the gang is not a hacking gang, it is a combat gang

                // Get the average of the multipliers for the ascension result and compare it to the ascension multiplier threshold
                let avg = getAverage(ns, [
                    currentMembers[i].ascensionResult.str,
                    currentMembers[i].ascensionResult.def,
                    currentMembers[i].ascensionResult.dex,
                    currentMembers[i].ascensionResult.agi
                ])
                if (avg >= ASC_MULT_THRESH) {
                    if (ns.gang.ascendMember(currentMembers[i].name) === undefined) {
                        ns.print("ERROR " + currentMembers[i].name + ": Failed to ascend gang member");
                    } else {
                        ns.print(currentMembers[i].name + ": Successfully ascended. They lost " + ns.formatNumber(currentMembers[i].ascensionResult.respect, 0) + " respect.");
                        if (args.train) {
                            if (currentMembers[i].task !== "Train Combat") {
                                if (!ns.gang.setMemberTask(currentMembers[i].name, "Train Combat")) {
                                    ns.print("ERROR " + currentMembers[i].name + ": Failed to assign to train combat");
                                } else {
                                    ns.print(currentMembers[i].name + ": Assigned to train combat");
                                }
                            }
                        }
                        if (args.equip) {
                            if (ns.run(EQUIP_MEMBERS_PATH, 1, currentMembers[i].name, "-a") === 0) {
                                ns.print("ERROR " + currentMembers[i].name + ": Failed to run " + EQUIP_MEMBERS_PATH);
                            }
                        }
                    }
                } else {
                    ns.print(currentMembers[i].name + ": Can ascend. Multiplier is x" + ns.formatNumber(avg, 5));
                }
            }
        }

        await ns.sleep(5000); // sleep for 5 seconds
    }
}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
}