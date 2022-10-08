/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let sleeves = {};
    let error = false;
    let taskPath = "/data/sleeve_tasks.txt";

    let args = ns.flags([["help", false], ["save", false]])

    if (args.help) {
        ns.tprintf("This script will assign your sleeves to certain tasks from a file and is intended to be used after a soft reset.");
        ns.tprintf("Option argument --save to save the current sleeve tasks to file. This will write to " + taskPath);
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example 1:");
        ns.tprintf(`> run ${ns.getScriptName()}`);
        ns.tprintf("Example 2:");
        ns.tprintf(`> run ${ns.getScriptName()} --save`);
        return;
    }

    if (args.save) {
        ns.tprint("Saving sleeve tasks to " + taskPath + "...");

        let numSleeves = ns.sleeve.getNumSleeves();
        let sleeveData = [];

        for (let i = 0; i < numSleeves; i++) {
            let sleeve = ns.sleeve.getTask(i);

            if (sleeve === null) {
                sleeve = {};
                sleeve.type = "IDLE";
            }
            if (sleeve.type === undefined) {
                sleeve.type = "BLADEBURNER";
            }
            // ns.setToUniversityCourse() doesn't like when the className parameter has no spaces
            if (sleeve.type === "CLASS") {
                switch (sleeve.classType) {
                    case "STUDYCOMPUTERSCIENCE":
                        sleeve.classType = "STUDY COMPUTER SCIENCE";
                        break;
                    case "DATASTRUCTURES":
                        sleeve.classType = "DATA STRUCTURES";
                        break;
                    case "GYMSTRENGTH":
                        sleeve.type = "GYM";
                        sleeve.classType = "TRAIN STRENGTH"; 
                    case "GYMDEFENSE":
                        sleeve.type = "GYM";
                        sleeve.classType = "TRAIN DEFENSE"; 
                    case "GYMDEXTERITY":
                        sleeve.type = "GYM";
                        sleeve.classType = "TRAIN DEXTERITY"; 
                    case "GYMAGILITY":
                        sleeve.type = "GYM";
                        sleeve.classType = "TRAIN AGILITY"; 
                }
            }

            sleeve.number = i;

            sleeveData.push(sleeve);
        }

        sleeveData = JSON.stringify(sleeveData, null, 1);
        ns.write(taskPath, sleeveData, "w");
        return;
    }

    sleeves = ns.read(taskPath);
    sleeves = JSON.parse(sleeves);

    for (let i = 0; i < sleeves.length; i++) {
        let sleeve = sleeves[i];

        try {
            switch (sleeve.type) {
                case "COMPANY":
                    if (!ns.sleeve.setToCompanyWork(sleeve.number, sleeve.companyName)) {
                        throw `ERROR Failed to assign ${sleeve.number} to work at ${sleeve.companyName}`;
                    }
                    break;
                case "FACTION":
                    if (!ns.sleeve.setToFactionWork(sleeve.number, sleeve.factionName, sleeve.factionWorkType)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.factionWorkType} for ${sleeve.factionName}`;
                    }
                    break;
                case "CRIME":
                    if (!ns.sleeve.setToCommitCrime(sleeve.number, sleeve.crimeType)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.crimeType}`;
                    }
                    break;
                case "CLASS":
                    if (!ns.sleeve.setToUniversityCourse(sleeve.number, sleeve.location, sleeve.classType)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.classType} at ${sleeve.location}`;
                    }
                    break;
                case "GYM":
                    if (!ns.sleeve.setToGymWorkout(sleeve.number, sleeve.location, sleeve.classType)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to train ${sleeve.classType} at ${sleeve.location}`;
                    }
                    break;
                case "BLADEBURNER":
                    if (sleeve.actionType === "Contracts") {
                        if (!ns.sleeve.setToBladeburnerAction(sleeve.number, "Take on contracts", sleeve.actionName)) {
                            throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.actionName} for Bladeburners`;
                        }
                    } else {
                        if (!ns.sleeve.setToBladeburnerAction(sleeve.number, sleeve.actionName)) {
                            throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.actionName} for Bladeburners`;
                        }
                    }
                    break;
                case "RECOVERY":
                    if (!ns.sleeve.setToShockRecovery(sleeve.number)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to Shock Recovery`;
                    }
                    break;
                case "SYNCHRONIZE":
                    if (!ns.sleeve.setToSynchronize(sleeve.number)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to Synchronize`;
                    }
                    break;
            }
        } catch (err) {
            ns.print(err);
            ns.toast("Failed to assign a sleeve", "error");
            error = true;
        }
    }

    if (!error) {
        ns.toast("Assigned all sleeves", "success");
    }

}