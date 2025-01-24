import { NS } from "@ns";
import { pServPrefix } from "/lib/const.js";

export async function main(ns: NS): Promise<void> {

    if (ns.args[0] === "help") {
        ns.tprintf("This script will prompt the user with a menu to purchase servers.");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [Amount of servers]`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} 25`);
        ns.exit();
    }

    let serverCount = Number(ns.args[0]);
    let cost: number = 0;
    let confirm: boolean = false;
    let purchasedCount: number = 0;
    let ram: number = -1;
    const pServLimit: number = ns.getPurchasedServerLimit();
    const pServMaxRam: number = ns.getPurchasedServerMaxRam();

    if (isNaN(serverCount)) {
        ns.tprint("Incorrect usage. Please provide valid [count] of servers to buy.");
    } else {
        if (serverCount > (pServLimit - ns.getPurchasedServers().length) || serverCount <= 0 || isNaN(serverCount)) {
            ns.tprint("Cannot buy that many servers!");
            ns.tprint("You can buy " + (pServLimit - ns.getPurchasedServers().length) + " more server(s).");
            ns.exit();
        }

        ram = Number(await ns.prompt("How many GB of RAM?", { type: "select", choices: getRamOptions(pServMaxRam) }));
        if (isNaN(ram)) {
            return;
        }
        if (!isPowerofTwo(ram)) {
            ns.tprint("RAM must be a power of two!");
        } else {
            cost = serverCount * ns.getPurchasedServerCost(ram);

            confirm = Boolean(await ns.prompt(`Purchasing ${serverCount} server(s) \nwith ${ns.formatRam(ram)} of RAM \nwill cost $${ns.formatNumber(cost)} \nConfirm?`, { type: "boolean" }));

            if (confirm) {
                if (cost > ns.getPlayer().money) {
                    ns.tprintf("You do not have enough money to purchase " + serverCount + " server(s) for $" + ns.formatNumber(cost) + "!");
                } else {

                    let purchasedServers = ns.getPurchasedServers();

                    for (let i = 0; i < serverCount; ++i) {
                        if (purchasedServers.includes(pServPrefix + i)) {
                            serverCount++;
                        } else {
                            if (serverCount <= pServLimit) {
                                let purchasedHost = ns.purchaseServer(pServPrefix + i, ram);
                                if (!(purchasedHost == "")) {
                                    purchasedCount++;
                                } else {
                                    ns.print("ERROR Failed to purchase " + pServPrefix + i);
                                }
                            } else {
                                ns.tprint("Cannot purchase any more servers!");
                            }
                        }
                    }
                }
                if (purchasedCount != 0) {
                    ns.tprintf(`Successfully purchased ${purchasedCount} server(s) with ${ns.formatRam(ram)} of RAM.`);

                    ns.tprintf(`
Thank you for shopping with us!
                
 __________________________________________
|                 888                      |
|                 888                      |
|  .d88b.  .d88b. 888 .d88b. 88888b.d88b.  |
| d88P"88bd88""88b888d8P  Y8b888 "888 "88b |
| 888  888888  88888888888888888  888  888 |
| Y88b 888Y88..88P888Y8b.    888  888  888 |
|  "Y88888 "Y88P" 888 "Y8888 888  888  888 |
|      888                                 |
| Y8b d88P                                 |
|  "Y88P"                server net        |
|__________________________________________|

`);
                }
            }
        }
    }
    function isPowerofTwo(x: number): boolean {
        return ((x != 0) && !(x & (x - 1)));
    }

    function getRamOptions(maxRam: number): string[] {
        let ramOptions: string[] = [];
        for (let i = 0; i <= maxRam; i++) {
            if (isPowerofTwo(i)) {
                ramOptions.push(String(i));
            }
        }
        return ramOptions;
    }
}