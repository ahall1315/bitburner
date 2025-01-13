// Attempts to open all ports and run NUKE.exe
// Switch '-s' for scan
// Swith '-n' for no terminal print

import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
    let target: string = <string>ns.args[0];
    let error: boolean = false;
    let openPorts: number = 0;
    let toPrint: boolean = true;

    if (ns.args[0] === "help") {
        ns.tprintf("Attempts to open all ports and run NUKE.exe");
        ns.tprintf("Optional argument -s to scan nearby servers and attempt to open ports on them.");
        ns.tprintf("Optional argument -n")
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} `);
        ns.exit();
    }

    const args = ns.flags([["n", false], ["s", false]]);

    if (args.n) {
        toPrint = false;
    }

    if (args.s) {
        let servers = ns.scan();

        servers.forEach(server => {
            ns.printf(`		----${server}----`);
            openPorts = 0;

            if (ns.hasRootAccess(server)) {
                ns.print("Already have root access on " + server + "!");
            } else {

                if (ns.fileExists("BruteSSH.exe", "home")) {
                    ns.brutessh(server);
                    openPorts++;
                } else {
                    ns.print(`Cannot run 'BruteSSH.exe'! on ${server} No such program.`);
                }
                if (ns.fileExists("FTPCrack.exe", "home")) {
                    ns.ftpcrack(server);
                    openPorts++;
                } else {
                    ns.print(`Cannot run 'FTPCrack.exe'! on ${server} No such program.`);
                }
                if (ns.fileExists("relaySMTP.exe", "home")) {
                    ns.relaysmtp(server);
                    openPorts++;
                } else {
                    ns.print(`Cannot run 'relaySMTP.exe'! on ${server} No such program.`);
                }
                if (ns.fileExists("HTTPWorm.exe", "home")) {
                    ns.httpworm(server);
                    openPorts++;
                } else {
                    ns.print(`Cannot run 'HTTPWorm.exe'! on ${server} No such program.`);
                }
                if (ns.fileExists("SQLInject.exe", "home")) {
                    ns.sqlinject(server);
                    openPorts++;
                } else {
                    ns.print(`Cannot run 'SQLInject.exe'! on ${server} No such program.`);
                }
                if (ns.fileExists("NUKE.exe", "home") && (openPorts >= ns.getServerNumPortsRequired(server))) {
                    ns.nuke(server);
                } else {
                    ns.print(`Cannot run 'NUKE.exe'! on '${server}'. Either no such program or not enough ports opened.`);
                    error = true;
                }

            }

        })
        if (toPrint) {
            ns.tprint("Finished opening ports on scanned servers.");
            if (error) {
                ns.tprint("Unable to grant root access on one or more of the servers. Are there enough programs on 'home'?")
            }
        }
    } else {
        openPorts = 0;

        if (target == undefined || target == "") {
            if (toPrint) {
                ns.tprint("Incorrect usage. Provide argument [hostname]");
            }
            ns.exit();
        } else {
            if (ns.hasRootAccess(target)) {
                if (toPrint) {
                    ns.tprint("Already have root access on " + target + "!");
                }
                ns.exit();
            } else {

                if (ns.fileExists("BruteSSH.exe", "home")) {
                    ns.brutessh(target);
                    openPorts++;
                } else {
                    ns.print("Cannot run 'BruteSSH.exe'! No such program.");
                    error = true;
                }
                if (ns.fileExists("FTPCrack.exe", "home")) {
                    ns.ftpcrack(target);
                    openPorts++;
                } else {
                    ns.print("Cannot run 'FTPCrack.exe'! No such program.");
                    error = true;
                }
                if (ns.fileExists("relaySMTP.exe", "home")) {
                    ns.relaysmtp(target);
                    openPorts++;
                } else {
                    ns.print("Cannot run 'relaySMTP.exe'! No such program.");
                    error = true;
                }
                if (ns.fileExists("HTTPWorm.exe", "home")) {
                    ns.httpworm(target);
                    openPorts++;
                } else {
                    ns.print("Cannot run 'HTTPWorm.exe'! No such program.");
                    error = true;
                }
                if (ns.fileExists("SQLInject.exe", "home")) {
                    ns.sqlinject(target);
                    openPorts++;
                } else {
                    ns.print("Cannot run 'SQLInject.exe'! No such program.");
                    error = true;
                }
                if (ns.fileExists("NUKE.exe", "home") && (openPorts >= ns.getServerNumPortsRequired(target))) {
                    ns.nuke(target);
                } else {
                    ns.print(`Cannot run 'NUKE.exe' on '${target}'. Either no such program or not enough open ports.`);
                    error = true;
                }

                if (!error) {
                    if (toPrint) {
                        ns.tprint("All ports succesfully opened and root access granted on " + target + ".");
                    }
                } else {
                    ns.print("Unable to open all ports on " + target + ". One or more of the programs does not exist on 'home'.");
                    if (ns.hasRootAccess(target)) {
                        if (toPrint) {
                            ns.tprint("Root access granted on " + target + ".");
                        }
                    } else {
                        ns.print("Unable to grant root access on " + target + ".");
                        if (toPrint) {
                            ns.tprint("Unable to grant root access. \n" + (ns.getServerNumPortsRequired(target) - openPorts) + " more ports must be opened on " + target + ".");
                        }
                    }
                }

            }

        }

    }
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return [...data.servers];
}