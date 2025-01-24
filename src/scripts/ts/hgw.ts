import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
    const args = ns.flags([["help", false]]);
    if (ns.args[0] === "help" || args.help) {
        ns.tprintf("Performs hack, grow, and weaken on a target server until the script is terminated");
        ns.tprintf("There are assigned thresholds in the script that determine when to hack, grow, or weaken");
        ns.tprintf("Add optional flag --tail to see a log of the script");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [target]`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    let target: string = <string>ns.args[0];

    if (target == undefined) {
        ns.tprint("Incorrect usage. Provide argument [hostname]")
    } else {
        if (!ns.hasRootAccess(target)) {
            ns.tprint("Cannot hack " + target + "! Need root access.");
            ns.exit();
        }

        const toDisable = ["getServerMaxMoney", "getServerMoneyAvailable", "getServerMinSecurityLevel", "getServerSecurityLevel", "getHackTime",
            "getGrowTime", "getWeakenTime"]
        toDisable.forEach(function (string) {
            ns.disableLog(string);
        })

        // Create number formatter for USD.
        let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        let serverMaxMoney = ns.getServerMaxMoney(target);
        let serverMoneyAvailable = ns.getServerMoneyAvailable(target);
        let serverMinSecurityLevel = ns.getServerMinSecurityLevel(target);

        let moneyThresh = serverMaxMoney * 0.50; // Weight is the threshold to hack
        let securityThresh = serverMinSecurityLevel + 5;

        while (true) {
            serverMoneyAvailable = ns.getServerMoneyAvailable(target);
            let serverSecurityLevel = ns.getServerSecurityLevel(target);

            // Get current local time
            let currentdate = new Date();
            let datetime = (currentdate.getMonth() + 1) + "/"
                + currentdate.getDate() + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours().toString().padStart(2, "0") + ":"
                + currentdate.getMinutes().toString().padStart(2, "0") + ":"
                + currentdate.getSeconds().toString().padStart(2, "0");

            ns.print("---------------------------------------------------")
            ns.print("             HACKING TARGET: " + target);
            ns.print("Available money: " + formatter.format(serverMoneyAvailable));
            ns.print("Server Max Money: " + formatter.format(serverMaxMoney));
            ns.print("Available to max ratio: " + ((serverMoneyAvailable / serverMaxMoney) * 100).toFixed(2) + "%");
            ns.print("Threshold to hack: " + ((moneyThresh / serverMaxMoney) * 100).toFixed(2) + "%");
            ns.print("");
            ns.print("Current security level: " + serverSecurityLevel.toFixed(2));
            ns.print("Threshold to weaken: " + securityThresh);
            ns.print("");

            if (serverSecurityLevel > securityThresh) {
                ns.print("Security level above threshold. Weakening security...\n")
                ns.print("Started on: " + datetime);
                ns.print("Will complete on: " + addMilliseconds(currentdate, ns.getWeakenTime(target)));
                ns.print("");
                await ns.weaken(target);
            } else if (serverMoneyAvailable < moneyThresh) {
                ns.print("Server money below threshold. Growing money...\n")
                ns.print("Started on: " + datetime);
                ns.print("Will complete on: " + addMilliseconds(currentdate, ns.getGrowTime(target)));
                ns.print("");
                await ns.grow(target);
            } else {
                ns.print("Within thresholds. Hacking target...\n")
                ns.print("Started on: " + datetime);
                ns.print("Will complete on: " + addMilliseconds(currentdate, ns.getHackTime(target)));
                ns.print("");
                await ns.hack(target);
            }
        }
    }

    function addMilliseconds(date: Date, ms: number): string {
        date = new Date(date.getTime() + ms);
        return (
            (date.getMonth() + 1) + "/"
            + date.getDate() + "/"
            + date.getFullYear().toString().padStart(2, "0") + " @ "
            + date.getHours().toString().padStart(2, "0") + ":"
            + date.getMinutes().toString().padStart(2, "0") + ":"
            + date.getSeconds().toString().padStart(2, "0")
        );
    }
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return [...data.servers];
}