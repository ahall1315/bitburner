/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    const rootX = args._[0];
    const rootY = args._[1];

    while (true) {{
        let fragments = ns.stanek.activeFragments();

        for (let i = 0; i < fragments.length; i++) {
            if (fragments[i].limit === 99) {
                fragments[i].isBooster = true;
            } else {
                fragments[i].isBooster = false;
            }

            if (!fragments[i].isBooster) {
                await ns.stanek.chargeFragment(fragments[i].x, fragments[i].y);
            }
        }
    }}
}