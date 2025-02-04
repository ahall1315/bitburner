import { NS, AutocompleteData } from "@ns";
import { CompanyName, FactionWorkType, CrimeType, UniversityLocationName,
        UniversityClassType, GymLocationName, GymType, BladeburnerContractName, BladeburnerActionTypeForSleeve } from "@ns";

export async function main(ns: NS): Promise<void> {
    let sleeves: Sleeve[] = [];
    let numSleeves: number = ns.sleeve.getNumSleeves();
    let error: boolean = false;
    const taskPath: string = "/data/sleeve_tasks.txt";

    let args = ns.flags([["help", false], ["save", false], ["reset", false]]);

    if (ns.args[0] === "help" || args.help) {
        ns.tprintf("This script will assign your sleeves to certain tasks from a file and is intended to be used after a soft reset.");
        ns.tprintf("Optional argument --save to save the current sleeve tasks to file. This will write to " + taskPath);
        ns.tprintf("Optional argument --reset to reset the sleeve tasks to idle for the file. This will write to " + taskPath);
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example 1:");
        ns.tprintf(`> run ${ns.getScriptName()}`);
        ns.tprintf("Example 2:");
        ns.tprintf(`> run ${ns.getScriptName()} --save`);
        ns.exit();
    }

    interface Sleeve {
        type: string;
        number: number;
        companyName?: string;
        factionName?: string;
        factionWorkType?: string;
        crimeType?: string;
        classType?: string;
        actionType?: string;
        actionName?: string;
        location?: string;
    }

    // Reset all sleeve tasks to idle in the file
    if (ns.args[0] === "reset" || args.reset) {
        ns.tprint("Resetting sleeve data...");
        ns.tprint("Writing to " + taskPath + "...");

        for (let i = 0; i < numSleeves; i++) {
            let sleeve: Sleeve = { number: i, type: "IDLE" };

            sleeves.push(sleeve);
        }
        ns.write(taskPath, JSON.stringify(sleeves, null, 1), "w");
        ns.exit();
    }

    // Save the current sleeve tasks to file
    if (ns.args[0] === "save" || args.save) {
        ns.tprint("Saving sleeve tasks to " + taskPath + "...");

        for (let i = 0; i < numSleeves; i++) {
            let sleeveTask = ns.sleeve.getTask(i);
            let sleeve: Sleeve = sleeveTask !== null ? { ...sleeveTask, number: i } : { type: "IDLE", number: i };

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

            sleeves.push(sleeve);
        }

        ns.write(taskPath, JSON.stringify(sleeves, null, 1), "w");
        ns.tprintf("Sleeve tasks written to " + taskPath);
        ns.exit();
    }

    if (ns.read(taskPath) === ""){
        ns.tprintf("No sleeve tasks found in " + taskPath);
        ns.tprintf("Does the file exist?");
        ns.tprintf("Use argument --save or --reset to create the file");
        ns.exit();
    }

    sleeves = JSON.parse(ns.read(taskPath));

    for (let i = 0; i < sleeves.length; i++) {
        let sleeve = sleeves[i];
        
        try {
            switch (sleeve.type) {
                case "COMPANY":
                    if (sleeve.companyName === undefined || !ns.sleeve.setToCompanyWork(sleeve.number, sleeve.companyName as CompanyName)) {
                        throw `ERROR Failed to assign ${sleeve.number} to work at ${sleeve.companyName}`;
                    }
                    break;
                case "FACTION":
                    if (sleeve.factionName === undefined ||
                        sleeve.factionWorkType === undefined ||
                        !ns.sleeve.setToFactionWork(sleeve.number, sleeve.factionName, sleeve.factionWorkType as FactionWorkType)) {
                            throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.factionWorkType} for ${sleeve.factionName}`;
                    }
                    break;
                case "CRIME":
                    if (sleeve.crimeType === undefined || 
                        !ns.sleeve.setToCommitCrime(sleeve.number, sleeve.crimeType as CrimeType)) {
                            throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.crimeType}`;
                    }
                    break;
                case "CLASS":
                    if (sleeve.location === undefined ||
                        sleeve.classType === undefined ||
                        !ns.sleeve.setToUniversityCourse(sleeve.number, sleeve.location as UniversityLocationName, sleeve.classType as UniversityClassType)) {
                            throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.classType} at ${sleeve.location}`;
                    }
                    break;
                case "GYM":
                    if (sleeve.location === undefined ||
                        sleeve.classType === undefined ||
                        !ns.sleeve.setToGymWorkout(sleeve.number, sleeve.location as GymLocationName, sleeve.classType as GymType)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.classType} at ${sleeve.location}`;
                    }
                    break;
                case "BLADEBURNER":
                    if (sleeve.actionType === "Contracts") {
                        if (!ns.sleeve.setToBladeburnerAction(sleeve.number, "Take on contracts", sleeve.actionName as BladeburnerContractName)) {
                            throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.actionName} for Bladeburners`;
                        }
                    } else {
                        if (!ns.sleeve.setToBladeburnerAction(sleeve.number, sleeve.actionName as BladeburnerActionTypeForSleeve)) {
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
                default:
                    // ns.sleeve.setToSynchronize() will assign a sleeve to idle if it cannot synchronize
                    if (!ns.sleeve.setToSynchronize(sleeve.number)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to Synchronize`;
                    }
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

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return ["--help", "--save", "--reset", "help", "save", "reset"];
}