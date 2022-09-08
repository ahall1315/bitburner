// Experiment with gang api

/** @param {NS} ns */
export async function main(ns) {
    const namesPath = "/misc/gang_member_names.txt"; // contents must be a comma seperated list
    let memberNames = [];
    let currentMembers = [];
    let gangInfo = null;
    let isHacking = false;
    const MAX_MEMBERS = 12;

    if (ns.fileExists(namesPath)) {
        memberNames = ns.read(namesPath);
        memberNames = memberNames.split(","); // Convert the memberNames string into an array

        if (memberNames.length < MAX_MEMBERS) {
            ns.tprint("Please provide a name for all " + MAX_MEMBERS + " gang members in " + namesPath);
            ns.exit();
        }
    } else {
        ns.tprint("File " + namesPath + " does not exist! Cannot run script.");
        ns.exit();
    }

    gangInfo = ns.gang.getGangInformation();

    //ns.tprint(JSON.stringify(gangInfo, null, 2));

    while (true) {
        currentMembers = ns.gang.getMemberNames();

        for (let i = 0; i < MAX_MEMBERS; i++) {
            if (ns.gang.canRecruitMember()) {
                // If the new recruit is not currently in the gang
                if (!currentMembers.includes(memberNames[i])) {
                    // Attempt to recruit them
                    if (!ns.gang.recruitMember(memberNames[i])) {
                        ns.print("Failed to recruit a gang member with the name " + memberNames[i] + ". Can you recruit a gang member with that name?");
                    } else {
                        // If they were successfully recruited, assign them to a training task
                        if (gangInfo.isHacking) {
                            if (!ns.gang.setMemberTask(memberNames[i], "Train Hacking")) {
                                ns.print("Failed to assign " + memberNames[i] + "to Train Hacking.");
                            }
                        } else {
                            if (!ns.gang.setMemberTask(memberNames[i], "Train Combat")) {
                                ns.print("Failed to assign " + memberNames[i] + "to Train Combat.");
                            }
                        }
                    }
                }
            }
        }

        await ns.sleep(10000); // sleep for 10 seconds
    }

}