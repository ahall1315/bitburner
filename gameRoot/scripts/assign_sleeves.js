/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    // Edit this list to change the tasks to be assigned to sleeves
    const sleeveTasks = {
        sleeves: [
            {
                number: "0",
                type: "FACTION",
                factionName: "Sector-12",
                factionWorkType: "Field Work"
            },
            {
                number: "1",
                type: "BLADEBURNER",
                actionName: "Support main sleeve"
            },
            {
                number: "2",
                type: "BLADEBURNER",
                actionName: "Recruitment"
            },
            {
                number: "3",
                type: "BLADEBURNER",
                actionName: "Diplomacy"
            },
            {
                number: "4",
                type: "BLADEBURNER",
                actionName: "Take on contracts",
                contract: "Retirement"
            }     

        ]
    }
    let error = false;

    for (let i = 0; i < sleeveTasks.sleeves.length; i++) {
        let sleeve = sleeveTasks.sleeves[i];

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
                    if (!ns.sleeve.setToCommitCrime(sleeve.number, sleeve.crimeName)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.crimeName}`;
                    }
                    break;
                case "CLASS":
                    if (!ns.sleeve.setToUniversityCourse(sleeve.number, sleeve.universityName, sleeve.className)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.className} at ${sleeve.universityName}`;
                    }
                    break;
                case "GYM":
                    if (!ns.sleeve.setToGymWorkout(sleeve.number, sleeve.gymName, sleeve.stat)) {
                        throw `ERROR Failed to assign sleeve ${sleeve.number} to train ${sleeve.stat} at ${sleeve.gymName}`;
                    }
                    break;
                case "BLADEBURNER":
                    if (sleeve.contract === undefined) {
                        if (!ns.sleeve.setToBladeburnerAction(sleeve.number, sleeve.actionName)) {
                            throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.actionName} for Bladeburners`;
                        }
                    } else {
                        if (!ns.sleeve.setToBladeburnerAction(sleeve.number, sleeve.actionName, sleeve.contract)) {
                            throw `ERROR Failed to assign sleeve ${sleeve.number} to ${sleeve.contract} for Bladeburners`;
                        }
                    }
                    break;
                case "SHOCK_RECOVERY":
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