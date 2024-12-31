/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    let numSleeves = ns.sleeve.getNumSleeves();
    let error = false;
    let count = 0;

    let args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprintf("This script will attempt to assign all of your sleeves to idle/synchronize.");
        ns.tprintf("The purpose of this script is build up bonus time for the sleeves.");
        ns.tprintf("This is useful for making shock recovery faster.");
        ns.tprintf("This script requires less RAM than assign_sleeves.js.");
        return;
    }
    
    for (let i = 0; i < numSleeves; i++) {
        if (ns.sleeve.setToSynchronize(i)) {
            ns.print("SUCCESS Sleeve " + i + " set to idle/synchronize.");
            count++;
        } else {
            ns.print("ERROR Failed to set sleeve " + i + " to idle/synchronize.");
            error = true;
        }
    }

    if (error) {
        ns.tprint("ERROR There was an error in assigning one or more of the sleeves.");
    }

    if (count === 0) {
        ns.tprint("Failed to assign any sleeves. Do you have any sleeves?");
    } else {
        ns.tprint("Assigned " + count + " sleeves to idle/synchronize.");
    }

}