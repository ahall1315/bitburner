/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let processInfo = [];
    let ramOptions = [];
    let ram = -1;
    let cost = -1;
    let error = false;
    const pServMaxRam = ns.getPurchasedServerMaxRam();

    const args = ns.flags([["help", false]]);
    if (args.help || args._[0] === undefined) {
        ns.tprintf("Upgrades the RAM of a purchased server.");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [target hostname]`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} pserv1`);
        return
    }
    
    const target = args._[0];
    if (!ns.serverExists(target)) {
        ns.tprint("WARN " + target + " is not a valid server!");
        return
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
            // Wait for files to copy
            await ns.sleep(500);

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