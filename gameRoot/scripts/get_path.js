// Gets the path to a given host

/** @param {NS} ns **/
export async function main(ns) {
    let startServer = ns.getHostname();
	let target = ns.args[0];
	if (target === undefined) {
        ns.tprint("Incorrect usage. Provide [hostname] of target.");
		ns.exit();
	}
	let [results, isFound] = findPath(target, startServer, [], [], false);
	if (!isFound) {
        ns.tprint("Server not found!");
	} else {
        ns.tprint(results.join(' --> '));
	}

    function findPath (target, serverName, serverList, ignore, isFound) {
        ignore.push(serverName);
        let scanResults = ns.scan(serverName);
        for (let server of scanResults) {
            if (ignore.includes(server)) {
                continue;
            }
            if (server === target) {
                serverList.push(server);
                return [serverList, true];
            }
            serverList.push(server);
            [serverList, isFound] = findPath(target, server, serverList, ignore, isFound);
            if (isFound) {
                return [serverList, isFound];
            }
            serverList.pop();
        }
        return [serverList, false];
    }
}