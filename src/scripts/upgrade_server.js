import { pServPrefix } from "/lib/const.js";
import { getRandomInt } from "/lib/utils.js";

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    let processInfo = [];
    let ramOptions = [];
    let ram = -1;
    let cost = -1;
    let error = false;
    const pServMaxRam = ns.getPurchasedServerMaxRam();
    const pServLimit = ns.getPurchasedServerLimit();

    const args = ns.flags([["help", false], ["auto", false]]);
    if (args.help || (args._[0] === undefined && args.auto == false)) {
        ns.tprintf("Upgrades the RAM of a purchased server.");
        ns.tprintf("Optonal argument --auto to automatically buy and upgrade servers to their max RAM.");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [target hostname]`);
        ns.tprintf("Example 1:");
        ns.tprintf(`> run ${ns.getScriptName()} pserv1`);
        ns.tprintf("Example 2:");
        ns.tprintf(`> run ${ns.getScriptName()} --auto`);
        return;
    }

    ns.disableLog("ALL");
    ns.resizeTail(554, 732);
    ns.moveTail(1147, -5);

    if (args.auto) {
        let servSlots = pServLimit - ns.getPurchasedServers().length;
        let fullyUpgraded = [];
        let target = "";
        cost = ns.getPurchasedServerCost(1);

        // Buys max amount of servers
        while (servSlots > 0) {
            for (let i = 0; i < pServLimit; i++) {
                if (!ns.serverExists(pServPrefix + i) && ns.getPlayer().money > cost) {
                    if (ns.purchaseServer(pServPrefix + i, 1) === "") {
                        error = true;
                    }
                }
            }
            if (cost > ns.getPlayer().money) {
                ns.print("Not enough money to buy a server. You need $" + ns.formatNumber(cost) + ". Waiting...");
            }
            servSlots = pServLimit - ns.getPurchasedServers().length;
            await ns.sleep(100);
        }

        // Populate fully upgraded list
        for (let i = 0; i < pServLimit; i++) {
            target = (pServPrefix + i);

            ram = ns.getServerMaxRam(target);

            // Add the pServ to the fully upgraded list if it is at max ram and it is not already in the list
            if (ram === pServMaxRam && !fullyUpgraded.includes(target)) {
                fullyUpgraded.push(target);
            }
        }

        // While not all servers are fully upgraded
        while (fullyUpgraded.length != pServLimit) {

            // For each purchased server
            for (let i = 0; i < pServLimit; i++) {
                target = (pServPrefix + i);

                // If the server is fully upgraded, skip it
                if (fullyUpgraded.includes(target)) {
                    continue;
                }

                ram = ns.getServerMaxRam(target);
                ramOptions = getRamOptions(pServMaxRam);

                // Get the max RAM for the current pServ that the player can buy
                for (let i = 0; i < ramOptions.length; i++) {
                    if (ramOptions[i] === ram) {
                        ram = ramOptions[i + 1];
                        if (ram !== undefined) {
                            cost = ns.getPurchasedServerCost(ram);
                            if (cost > ns.getPlayer().money) {
                                ram = ramOptions[i];
                                break;
                            }
                        } else {
                            ram = ramOptions[i];
                        }
                    }
                }

                cost = ns.getPurchasedServerCost(ram);

                if (cost > ns.getPlayer().money) {
                    ns.print("You don't have enough money to upgrade " + target + "!");
                    ns.print("You need $" + ns.formatNumber(cost));
                    continue;
                }

                // If the highest RAM the player can afford is the current RAM of the target, do nothing
                if (ram === ns.getServerMaxRam(target)) {
                    // Get the next tier of ram the server can be upgraded to
                    ram = ramOptions[ramOptions.indexOf(ram) + 1];
                    cost = ns.getPurchasedServerCost(ram);

                    ns.print("You don't have enough money to upgrade " + target + "!");
                    ns.print("You need $" + ns.formatNumber(cost));
                    continue;
                }

                ns.killall(target, true);
                if (!ns.deleteServer(target)) {
                    ns.print("ERROR Failed to delete " + target + "!");
                    error = true;
                }

                if (!error) {
                    if (ns.purchaseServer(target, ram) === "") {
                        ns.print("ERROR Failed to upgrade " + target + " with " + ns.formatRam(ram));
                        error = true;
                    } else {
                        if (ram === pServMaxRam) {
                            fullyUpgraded.push(target);
                        }

                        // Copy files from home to the upgraded server
                        ns.exec("/scripts/scp.js", "home", 1, "/scripts/", target);
                        ns.exec("/scripts/scp.js", "home", 1, "/lib/", target);
                        ns.exec("/scripts/scp.js", "home", 1, "/control/", target);
                        await ns.sleep(500);// Wait for files to copy

                        // Charge fragments one tenth of the time
                        if (getRandomInt(ns, 1, 10) == 1) {
                            ns.exec("/scripts/stanek/charge_fragment.js", target, 1, "--max");
                        } else {
                            ns.exec("/scripts/hack_all.js", target, 1, "--killHack")
                        }

                    }
                }
            }
            ns.print(buildPrintString());
            await ns.sleep(100);
        }

        if (error) {
            ns.tprint("There was an error in running the script");
        } else {
            ns.print("SUCCESS All servers successfully upgraded to max RAM!");
        }

        return;

    }

    const target = args._[0];
    if (!ns.serverExists(target)) {
        ns.tprint("WARN " + target + " is not a valid server!");
        return;
    }

    processInfo = ns.ps(target);
    ram = ns.getServerMaxRam(target);
    ramOptions = getRamOptions(pServMaxRam);

    for (let i = 0; i < ramOptions.length; i++) {
        if (ramOptions[i] === ram) {
            ram = ramOptions[i + 1];
            break;
        }
    }
    if (ram === undefined) {
        ns.tprint("Cannot upgrade " + target + " any more!");
        return;
    }

    cost = ns.getPurchasedServerCost(ram);

    if (cost > ns.getPlayer().money) {
        ns.tprint("You don't have enough money to upgrade " + target + "!");
        ns.tprint("You need $" + ns.formatNumber(cost));
        return;
    }

    ns.killall(target, true);
    if (!ns.deleteServer(target)) {
        ns.print("ERROR Failed to delete " + target + "!");
        error = true;
    }

    if (!error) {
        if (ns.purchaseServer(target, ram) === "") {
            ns.print("ERROR Failed to upgrade " + target + " with " + ns.formatRam(ram));
            error = true;
        } else {
            // Copy files from home to the upgraded server
            ns.exec("/scripts/scp.js", "home", 1, "/scripts/", target);
            ns.exec("/scripts/scp.js", "home", 1, "/lib/", target);
            ns.exec("/scripts/scp.js", "home", 1, "/control/", target);
            await ns.sleep(500);// Wait for files to copy

            for (let i = 0; i < processInfo.length; i++) {
                if (ns.exec(processInfo[i].filename, target, processInfo[i].threads, ...processInfo[i].args) === 0) {
                    error = true;
                }
            }
        }
    }

    if (error) {
        ns.tprint("There was an error in running the script");
    } else {
        ns.print("SUCCESS Upgraded " + target + " to " + ns.formatRam(ram) + " of RAM for $" + ns.formatNumber(cost));
        ns.tprint("Upgraded " + target + " to " + ns.formatRam(ram) + " of RAM for $" + ns.formatNumber(cost));
    }

    function getRamOptions(maxRam) {
        let ramOptions = [];
        for (let i = 0; i <= maxRam; i++) {
            if (isPowerofTwo(i)) {
                ramOptions.push(i);
            }
        }
        return ramOptions;
    }

    function isPowerofTwo(x) {
        return ((x != 0) && !(x & (x - 1)));
    }

    function buildPrintString() {
        let pServs = ns.getPurchasedServers();
        let printString = "_________________________________________________________\n";
        // Sorts purchased servers least to greatest
        pServs = pServs.sort((a, b) => {
            a = a.replace(pServPrefix, "");
            b = b.replace(pServPrefix, "");

            return a - b;
        });

        for (let i = 0; i < pServs.length; i++) {
            printString = printString.concat(
`   ${pServs[i]} | Total RAM: ${ns.formatRam(ns.getServerMaxRam(pServs[i]), 0)} | Used RAM: ${ns.formatRam(ns.getServerUsedRam(pServs[i]), 0)} (${(ns.getServerUsedRam(pServs[i]) / ns.getServerMaxRam(pServs[i]) * 100).toFixed(2)}%)\n`
);
        }
        printString = printString.concat("‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾");

        return printString;
    }
}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
}