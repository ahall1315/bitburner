// Hacks all servers from home that you can hack with maximum threads

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    const hackScript = "/scripts/hack.js";
    const host = ns.getHostname();
    const toHackPath = "/data/can_hack.txt";
    const noPrintSwitch = "-n";
    const noMoneySwitch = "-m";

    let canHack = [];
    let toHack = [];
    let pid = -1;
    let threads = 0;
    let error = false;

    const args = ns.flags([["help", false], ["killHack", false]]);
    if (args.help) {
        ns.tprint("This script will hack all servers you can hack with the maximum amount of threads. It will kill all running scripts and start the script /scripts/hack.js.");
        ns.tprint("Optional argument '--killHack' to only kill the hacking scripts.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} --killHack`);
        return;
    }

    if (args.killHack) {
        ns.scriptKill(hackScript, host);
    } else {
        ns.killall(host, true);
    }

    await ns.sleep(1000); // Waits for scripts to be killed

    // Populate can_hack.txt
    pid = ns.run("/scripts/crawler.js", 1, noMoneySwitch);
    await ns.sleep(1000); // Waits for can_hack.txt to be populated
    error = checkError(pid);

    if (!error) {
        threads = getMaxThreads(host);
        ns.tprint("[" + host + "] Total threads: " + threads);
    
        canHack = ns.read(toHackPath);
        canHack = JSON.parse(canHack);
    
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

    function getMaxThreads(host) {
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
    function divideThreads(threads, targets) {
        return Math.floor(threads / targets.length);
    }

    function checkError(pid) {
        if (pid <= 0) {
            return true;
        } else {
            return false;
        }
    }

    async function attemptHack(host, targets, threads, noPrintSwitch) {
        ns.tprint("[" + host + "] Attempting to hack...");

        if (threads === 0) {
            ns.tprint("[" + host + "] Error: 0 threads while attempting to hack targets.")
            error = true;
        }

        if (targets.length === 0 || targets.includes("") || error === true) {
            error = true;
        } else {
            for (let i = 0; i < targets.length; i++) {
                ns.run("/scripts/open_ports.js", 1, targets[i], noPrintSwitch);
                await ns.sleep(250); // Waits for ports to be opened
                if (ns.isRunning("/scripts/hack.js", host, targets[i])) {
                    ns.print("Hack script already running for target: " + targets[i] + "! Killing script.")
                    ns.kill("/scripts/hack.js", host, targets[i])
                }
                pid = ns.run("/scripts/hack.js", threads, targets[i]);

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