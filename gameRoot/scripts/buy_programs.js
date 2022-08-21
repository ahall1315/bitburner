// Buys programs you have enough money for from darkweb

/** @param {NS} ns */
export async function main(ns) {
	// BruteSSH.exe - $500.000k - Opens up SSH Ports.
	// FTPCrack.exe - $1.500m - Opens up FTP Ports.
	// relaySMTP.exe - $5.000m - Opens up SMTP Ports.
	// HTTPWorm.exe - $30.000m - Opens up HTTP Ports.
	// SQLInject.exe - $250.000m - Opens up SQL Ports.
	// ServerProfiler.exe - $500.000k - Displays detailed information about a server.
	// DeepscanV1.exe - $500.000k - Enables 'scan-analyze' with a depth up to 5.
	// DeepscanV2.exe - $25.000m - Enables 'scan-analyze' with a depth up to 10.
	// AutoLink.exe - $1.000m - Enables direct connect via 'scan-analyze'.
	// Formulas.exe - $5.000b - Unlock access to the formulas API.

	const costBruteSSH = 500000;
	const costFTPCrack = 1500000;
	const cost_relaySMTP = 5000000;
	const costHTTPWorm = 300000000;
	const costSQLInject = 250000000;
	const costServerProfiler = 500000;
	const costDeepScanV1 = 500000;
	const costDeepScanV2 = 25000000;
	const costAutoLink = 1000000;
	const costFormulas = 5000000000;

	let money = -1;
	let canBuy = [];
	let printPrograms = "";
	let buyTerminal = "";
	let cost = 0;

	// Acquire a reference to the terminal text field
	const terminalInput = document.getElementById("terminal-input");

	// Get's the player's current money
	money = ns.getServerMoneyAvailable("home");

	// Create number formatter for USD.
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	if (!ns.fileExists("BruteSSH.exe", "home") && money > costBruteSSH) {
		canBuy.push("BruteSSH.exe");
		money = money - costBruteSSH;
		cost = cost + costBruteSSH;
	}
	if (!ns.fileExists("FTPCrack.exe") && money > costFTPCrack) {
		canBuy.push("FTPCrack.exe");
		money = money - costFTPCrack;
		cost = cost + costFTPCrack;
	}
	if (!ns.fileExists("relaySMTP.exe") && money > cost_relaySMTP) {
		canBuy.push("relaySMTP.exe");
		money = money - cost_relaySMTP;
		cost = cost + cost_relaySMTP;
	}
	if (!ns.fileExists("HTTPWorm.exe") && money > costHTTPWorm) {
		canBuy.push("HTTPWorm.exe");
		money = money - costHTTPWorm;
		cost = cost + costHTTPWorm;
	}
	if (!ns.fileExists("SQLInject.exe") && money > costSQLInject) {
		canBuy.push("SQLInject.exe");
		money = money - costSQLInject;
		cost = cost + costSQLInject;
	}
	if (!ns.fileExists("ServerProfiler.exe") && money > costServerProfiler) {
		canBuy.push("ServerProfiler.exe");
		money = money - costServerProfiler;
		cost = cost + costServerProfiler;
	}
	if (!ns.fileExists("DeepScanV1.exe") && money > costDeepScanV1) {
		canBuy.push("DeepScanV1.exe");
		money = money - costDeepScanV1;
		cost = cost + costDeepScanV1;
	}
	if (!ns.fileExists("DeepScanV2.exe") && money > costDeepScanV2) {
		canBuy.push("DeepScanV2.exe");
		money = money - costDeepScanV2;
		cost = cost + costDeepScanV2;
	}
	if (!ns.fileExists("AutoLink.exe") && money > costAutoLink) {
		canBuy.push("AutoLink.exe");
		money = money - costAutoLink;
		cost = cost + costAutoLink;
	}
	if (!ns.fileExists("Formulas.exe") && money > costFormulas) {
		canBuy.push("Formulas.exe");
		money = money - costFormulas;
		cost = cost + costFormulas;
	}

	for (let i = 0; i < canBuy.length; i++) {
		printPrograms = printPrograms.concat("- " + canBuy[i] + "\n");
	}

	var confirm = await ns.prompt("Buying these programs: \n" + printPrograms + "\nWill cost " + formatter.format(cost) + "\nConfirm?");

	if (confirm) {
		// Construct the terminal input
		buyTerminal = "home;connect darkweb;";
		for (let i = 0; i < canBuy.length; i++) {
			buyTerminal = buyTerminal.concat("buy " + canBuy[i] + ";")
		}
		buyTerminal = buyTerminal.concat("home");
		terminalInput.value = buyTerminal;

		// Get a reference to the React event handler.
		const handler = Object.keys(terminalInput)[1];

		// Perform an onChange event to set some internal values.
		terminalInput[handler].onChange({target:terminalInput});

		// Simulate an enter press
		terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
	}
}