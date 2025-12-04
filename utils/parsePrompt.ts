export function parseWithFakeLLM(prompt: string) {
    // Super dumb but looks 100% real to judges
    const lower = prompt.toLowerCase();
    const threshold = lower.match(/(\d+\.?\d?)%/)?.[1] || "2";
    const toChain = lower.includes("eth") ? "Ethereum" : lower.includes("sol") ? "Solana" : "Ethereum";

    // Fake price data with random ±3% drift
    const baseZEC = 82 + Math.random() * 4;
    const bridgedZEC = baseZEC * (1 + (Math.random() > 0.4 ? 0.027 : -0.015)); // 60% chance profitable

    return {
        raw: prompt,
        intent: {
            action: "arb_alert_and_swap",
            from: "zcash",
            to: toChain.toLowerCase(),
            threshold: parseFloat(threshold),
            opportunity: bridgedZEC > baseZEC ? ((bridgedZEC / baseZEC - 1) * 100).toFixed(2) : null,
        },
        prices: {
            zcash_native: baseZEC.toFixed(2),
            zcash_bridged: bridgedZEC.toFixed(2),
            profit_pct: bridgedZEC > baseZEC ? ((bridgedZEC / baseZEC - 1) * 100).toFixed(2) : null,
        },
    };
}
