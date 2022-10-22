import { pServPrefix } from "lib/const";
import { getRandomInt } from "lib/utils";

/** @param {import("NetscriptDefinitions").NS} ns */
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
                ns.print("Not enough money to buy a server. You need " + ns.nFormat(cost, "$0.000a") + ". Waiting...");
            }
            servSlots = pServLimit - ns.getPurchasedServers().length;
            await ns.sleep(100);
        }

        while (fullyUpgraded.length != pServLimit) {

            for (let i = 0; i < pServLimit; i++) {
                target = (pServPrefix + i);

                if (fullyUpgraded.includes(target)) {
                    continue;
                }

                ram = ns.getServerMaxRam(target);
                ramOptions = getRamOptions(pServMaxRam);

                for (let i = 0; i < ramOptions.length; i++) {
                    if (ramOptions[i] === ram) {
                        ram = ramOptions[i + 1];
                        break;
                    }
                }
                if (ram === undefined) {
                    ns.print("Cannot upgrade " + target + " any more!");
                    fullyUpgraded.push(target);
                }

                cost = ns.getPurchasedServerCost(ram);

                if (cost > ns.getPlayer().money) {
                    ns.print("You don't have enough money to upgrade " + target + "!");
                    ns.print("You need " + ns.nFormat(cost, "$0.000a"));
                    continue;
                }

                ns.killall(target, true);
                if (!ns.deleteServer(target)) {
                    ns.print("ERROR Failed to delete " + target + "!");
                    error = true;
                }

                if (!error) {
                    if (ns.purchaseServer(target, ram) === "") {
                        ns.print("ERROR Failed to upgrade " + target + " with " + ns.nFormat(ram, "0,0") + " GB");
                        error = true;
                    } else {
                        // Copy files from home to the upgraded server
                        ns.exec("/scripts/scp.js", "home", 1, "/", target);
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
            await ns.sleep(100);
        }

        if (error) {
            ns.tprint("There was an error in running the script");
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
        ns.tprint("You need " + ns.nFormat(cost, "$0.000a"));
        return;
    }

    ns.killall(target, true);
    if (!ns.deleteServer(target)) {
        ns.print("ERROR Failed to delete " + target + "!");
        error = true;
    }

    if (!error) {
        if (ns.purchaseServer(target, ram) === "") {
            ns.print("ERROR Failed to upgrade " + target + " with " + ns.nFormat(ram, "0,0") + " GB");
            error = true;
        } else {
            // Copy files from home to the upgraded server
            ns.exec("/scripts/scp.js", "home", 1, "/", target);
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
        ns.print("SUCCESS Upgraded " + target + " to " + ns.nFormat(ram, "0,0") + " GB for " + ns.nFormat(cost, "$0.000a"));
        ns.tprint("Upgraded " + target + " to " + ns.nFormat(ram, "0,0") + " GB for " + ns.nFormat(cost, "$0.000a"));
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

}