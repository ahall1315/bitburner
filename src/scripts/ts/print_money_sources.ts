import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    const formattedSources = formatMoneySources();
    ns.tprint(`Formatted Money Sources:\n${formattedSources}`);

    function formatMoneySources(): string {
        const moneySources = ns.getMoneySources(); // Get raw money sources data
        const formatted: Record<string, any> = {};
    
        // Iterate over each key in the object
        for (const [key, value] of Object.entries(moneySources)) {
            if (typeof value === "number") {
                // Format numbers as money
                formatted[key] = ns.formatNumber(value);
            } else if (typeof value === "object" && value !== null) {
                // Format nested numbers in sub-objects
                formatted[key] = {};
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (typeof subValue === "number") {
                        formatted[key][subKey] = ns.formatNumber(subValue);
                    } else {
                        formatted[key][subKey] = subValue; // Keep non-number values as-is
                    }
                }
            } else {
                formatted[key] = value; // Keep non-number values as-is
            }
        }
    
        // Convert the formatted object to a readable JSON-like string
        return JSON.stringify(formatted, null, 2);
    }
}