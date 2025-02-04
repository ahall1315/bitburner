// Hacks all servers from home that you can hack with maximum threads

import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
    const args = ns.flags([["help", false], ["killHack", false]]);
    if (ns.args[0] === "help" || args.help) {
        ns.tprintf("This script will hack all servers (With the HGW script) you can hack with the maximum amount of threads. It will kill all running scripts and start the script /scripts/ts/hgw.js.");
        ns.tprintf("Optional argument '--killHack' to only kill the hacking scripts.");
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} --killHack`);
        ns.exit();
    }

    const hackScript = "/scripts/ts/hgw.js";
    const host = ns.getHostname();
    const toHackPath = "/data/can_hack.txt";
    const noPrintSwitch = "-n";
    const noMoneySwitch = "-m";

    let canHack: string[] = [];
    let toHack: string[] = [];
    let pid: number = -1;
    let threads: number = 0;
    let error: boolean = false;

    if (args.killHack || ns.args[0] === "killHack") {
        ns.scriptKill(hackScript, host);
    } else {
        ns.killall(host, true);
    }

    await ns.sleep(1000); // Waits for scripts to be killed

    // Populate can_hack.txt
    pid = ns.run("/scripts/ts/crawler.js", 1, noMoneySwitch);
    await ns.sleep(1000); // Waits for can_hack.txt to be populated
    error = checkError(pid);

    if (!error) {
        threads = getMaxThreads(host);
        ns.tprint("[" + host + "] Total threads: " + threads);
    
        canHack = JSON.parse(ns.read(toHackPath));
    
        for (let i = 0; i < canHack.length; i++) {
            toHack.push(canHack[i]);
        }
    
        threads = divideThreads(threads, toHack);
        ns.tprint("[" + host + "] Threads per target: " + threads);
    
        await attemptHack(host, toHack, threads, noPrintSwitch);
    }

    if (error) {
        ns.tprint("[" + host + "] There was an error in running the script.");
    }

    function getMaxThreads(host: string) {
        var serverMaxRam = ns.getServerMaxRam(host);
        
        if (serverMaxRam <= 32) {
            var maxRam = ns.getServerMaxRam(host)
        } else {
            var maxRam = ns.getServerMaxRam(host) - 32; // Leaves at least 32 GB to leave room for scripts to run
        }

        var scriptRam = ns.getScriptRam(hackScript)

        return Math.floor(maxRam / scriptRam)
    }

    // Divides threads amongst the targets
    function divideThreads(threads: number, targets: string[]) {
        return Math.floor(threads / targets.length);
    }

    function checkError(pid: number) {
        if (pid <= 0) {
            return true;
        } else {
            return false;
        }
    }

    async function attemptHack(host: string, targets: string[], threads: number, noPrintSwitch: string) {
        ns.tprint("[" + host + "] Attempting to hack...");

        if (threads === 0) {
            ns.tprint("[" + host + "] Error: 0 threads while attempting to hack targets.")
            error = true;
        }

        if (targets.length === 0 || targets.includes("") || error === true) {
            error = true;
        } else {
            for (let i = 0; i < targets.length; i++) {
                ns.run("/scripts/ts/open_ports.js", 1, targets[i], noPrintSwitch);
                await ns.sleep(250); // Waits for ports to be opened
                if (ns.isRunning("/scripts/ts/hgw.js", host, targets[i])) {
                    ns.print("Hack script already running for target: " + targets[i] + "! Killing script.")
                    ns.kill("/scripts/ts/hgw.js", host, targets[i])
                }
                pid = ns.run("/scripts/ts/hgw.js", threads, targets[i]);

                error = checkError(pid);
            }
            if (targets.length === 1) {
                ns.tprint("[" + host + "] Hacking server...")
            } else {
                ns.tprint("[" + host + "] Hacking multiple servers...");
            }
        }

        if (error) {
            ns.tprint("[" + host + "] There was an error in hacking one or more servers. Is there enough RAM?");
        }
    }

}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return ["help", "--help", "killHack", "--killHack"];
}