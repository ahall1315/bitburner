import { getAverage } from "/lib/utils.js";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false], ["train", false], ["equip", false]]);
    if (args.help) {
        ns.tprintf("This script will automatically ascend gang members.");
        ns.tprintf("Optional argument --train to assign gang members to train after ascending.");
        ns.tprintf("Optional argument --equip to buy equipment for the gang member after ascending.");
        return;
    }
    
    const ASC_MULT_THRESH = 2 // Ascension multiplier threshold
    const EQUIP_MEMBERS_PATH = "/scripts/equip_members.js";
    let currentMembers = [];
    let memberInfo = null;
    let gangInfo = null;
    let res = null;
    
    if (!ns.gang.inGang()) {
        ns.tprint("INFO You are not in a gang! You must join one before you can ascend gang members.");
        return;
    }

    ns.disableLog("disableLog");
    ns.disableLog("gang.setMemberTask");
    ns.disableLog("gang.ascendMember");
    
    while (true) {
        currentMembers = ns.gang.getMemberNames();
        gangInfo = ns.gang.getGangInformation();

        for (let i = 0; i < currentMembers.length; i++) {
            res = ns.gang.getAscensionResult(currentMembers[i]);
            memberInfo = ns.gang.getMemberInformation(currentMembers[i]);

            if (gangInfo.isHacking) {
                if (res.hack >= ASC_MULT_THRESH) {
                    if (ns.gang.ascendMember(currentMembers[i]) === undefined) {
                        ns.print("ERROR Failed to ascend gang member " + currentMembers[i]);
                    } else {
                        ns.print("Successfully ascended " + currentMembers[i] + ". They lost " + ns.formatNumber(res.respect, 0) + " respect.");
                        if (args.train) {
                            if (memberInfo.task !== "Train Hacking") {
                                if (!ns.gang.setMemberTask(currentMembers[i], "Train Hacking")) {
                                    ns.print("ERROR Failed to assign " + currentMembers[i] + " to train hacking");
                                } else {
                                    ns.print("Assigned " + currentMembers[i] + " to train hacking");
                                }
                            }
                        }
                        if (args.equip) {
                            ns.run(EQUIP_MEMBERS_PATH, 1, currentMembers[i], "-a");
                        }
                    }
                }
            } else {
                // If combat gang
                if (getAverage(ns, [res.str, res.def, res.dex, res.agi]) >= ASC_MULT_THRESH) {
                    if (ns.gang.ascendMember(currentMembers[i]) === undefined) {
                        ns.print("ERROR Failed to ascend gang member " + currentMembers[i]);
                    } else {
                        ns.print("Successfully ascended " + currentMembers[i] + ". They lost " + ns.formatNumber(res.respect, 0) + " respect.");
                        if (args.train) {
                            if (memberInfo.task !== "Train Combat") {
                                if (!ns.gang.setMemberTask(currentMembers[i], "Train Combat")) {
                                    ns.print("ERROR Failed to assign " + currentMembers[i] + " to train combat");
                                } else {
                                    ns.print("Assigned " + currentMembers[i] + " to train combat");
                                }
                            }
                        }
                        if (args.equip) {
                            ns.run(EQUIP_MEMBERS_PATH, 1, currentMembers[i], "-a");
                        }
                    }
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