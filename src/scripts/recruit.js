import { getRandomInt } from "/lib/utils.js";
import { MAX_MEMBERS } from "/lib/const.js";

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    const namesPath = "/data/gang_member_names.txt"; // Contents must be a comma seperated list

    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprintf("This script will automatically recruit gang members and assign them to train combat if you are in a combat gang and train hacking if you are in a hacking gang.");
        ns.tprintf("Gang members will be randomly assigned a name that is listed in " + namesPath + ". Contents of the file must be a csv.");
        return;
    }

    let memberNames = [];
    let currentMembers = [];
    let gangInfo = null;
    let rand = -1; // Random number
    
    if (!ns.gang.inGang()) {
        ns.tprint("INFO You are not in a gang! You must join one before you can recruit.");
    }

    if (ns.fileExists(namesPath)) {
        memberNames = ns.read(namesPath);
        memberNames = memberNames.split(","); // Convert the memberNames string into an array

        if (memberNames.length < MAX_MEMBERS) {
            ns.tprint("Please provide a name for at least " + MAX_MEMBERS + " gang members in " + namesPath);
            ns.exit();
        }

        // Allow for newline characters in the csv file
        for (let i = 0; i < memberNames.length; i++) {
            if (memberNames[i].includes("\r") || memberNames[i].includes("\n")) {
                memberNames[i] = memberNames[i].replace("\r", "");
                memberNames[i] = memberNames[i].replace("\n", "");
            }
        }
    } else {
        ns.tprint("File " + namesPath + " does not exist! Cannot run script.");
        ns.exit();
    }

    while (true) {
        try {
            gangInfo = ns.gang.getGangInformation();
            currentMembers = ns.gang.getMemberNames();

            rand = getRandomInt(ns, 0, memberNames.length - 1);

            // If the name is already in the gang, remove that name from the list of possible recruits
            if (currentMembers.includes(memberNames[rand])) {
                memberNames.splice(rand, 1);
                continue;
            }

            if (ns.gang.canRecruitMember()) {
                // If the new recruit is not currently in the gang
                if (!currentMembers.includes(memberNames[rand])) {
                    // Attempt to recruit them
                    if (!ns.gang.recruitMember(memberNames[rand])) {
                        ns.print("Failed to recruit a gang member with the name " + memberNames[i] + ". Can you recruit a gang member with that name?");
                    } else {
                        // If they were successfully recruited, assign them to a training task
                        if (gangInfo.isHacking) {
                            if (!ns.gang.setMemberTask(memberNames[rand], "Train Hacking")) {
                                ns.print("Failed to assign " + memberNames[rand] + "to Train Hacking.");
                            }
                        } else {
                            if (!ns.gang.setMemberTask(memberNames[rand], "Train Combat")) {
                                ns.print("Failed to assign " + memberNames[rand] + "to Train Combat.");
                            }
                        }
                        memberNames.splice(rand, 1); // Remove the name of the newly recruited member from the list of possible recruits
                    }
                }
            }
        } catch {
            ns.printf("ERROR Failed to recruit a gang member. Are you in a gang?");
        }

        await ns.sleep(10000); // sleep for 10 seconds
    }

}