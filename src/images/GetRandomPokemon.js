// Gets random sprite from PokéAPI and writes it to destination file
// run GetRandomPokemon.js poke.txt ; cat poke.txt 

/** @param {NS} ns */
export async function main(ns) {

	if (ns.args[0] == undefined) {
		ns.tprint("Incorrect usage. Provide argument [destination]")
	} else {

		await ns.wget(`https://pokeapi.co/api/v2/pokemon/${getRandomInt(1, 898)}`, "/images/json.txt");
		var content = await ns.read("/images/json.txt");
		var pokeJSON = JSON.parse(content);

		// Chance for shiny
		if (1 == getRandomInt(1, 4096)) {
			await ns.write(ns.args[0], `<img src=\"${pokeJSON.sprites.front_shiny}\" width="300" height="300"></img>`, "w");
			ns.print(`<img src=\"${pokeJSON.sprites.front_default}\" width="300" height="300"></img>`)

		} else {
			await ns.write(ns.args[0], `<img src=\"${pokeJSON.sprites.front_default}\" width="300" height="300"></img>`, "w");
			ns.print(`<img src=\"${pokeJSON.sprites.front_default}\" width="300" height="300"></img>`)
		}

	}


	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
	}
};