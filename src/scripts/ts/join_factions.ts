// Automatically joins factions

import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
    let invitations: string[] = [];
    let joinRivalFactions: boolean = false;

    const rivalFactions = [
        "Sector-12",
        "Chongqing",
        "New Tokyo",
        "Ishima",
        "Aevum",
        "Volhaven"
    ]

    const args = ns.flags([["help", false], ["a", false]])
    if (ns.args[0] === "help" || args.help) {
        ns.tprint("This script will run in the background and join any factions you are invited to.");
        ns.tprint("It will not join factions that prevent you from joining other factions unless the argument -a is provided.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} -a`);
        ns.exit();
    }

    if (ns.args[0] === "a" || ns.args[0] === "all" || args.a) {
        joinRivalFactions = true;
    }

    while (true) {
        invitations = ns.singularity.checkFactionInvitations();

        if(!joinRivalFactions) {
            invitations = invitations.filter(faction => !rivalFactions.includes(faction));
        }

        for (let i = 0; i < invitations.length; i++) {
            ns.singularity.joinFaction(invitations[i]);
            ns.toast("Joined " + invitations[i]);
        }

        await ns.sleep(1000);
    }
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return ["help", "a", "all", "--help", "-a", "--all"];
}