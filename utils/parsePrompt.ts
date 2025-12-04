import { getPrices } from "@/lib/prices";

export async function parseWithFakeLLM(prompt: string) {
    const lower = prompt.toLowerCase();
    const threshold = lower.match(/(\d+\.?\d?)%/)?.[1] || "2";
    const toChain = lower.includes("eth") ? "Ethereum" : lower.includes("sol") ? "Solana" : "Ethereum";

    const prices = await getPrices();
    const baseZEC = prices.zec;
    const targetPrice = toChain.toLowerCase() === "ethereum" ? prices.eth : prices.sol;

    const priceDiff = ((targetPrice - baseZEC) / baseZEC) * 100;

    return {
        raw: prompt,
        intent: {
            action: "arb_alert_and_swap",
            from: "zcash",
            to: toChain.toLowerCase(),
            threshold: parseFloat(threshold),
            opportunity: priceDiff > 0 ? priceDiff.toFixed(2) : null,
        },
        prices: {
            zcash_price: baseZEC.toFixed(2),
            target_price: targetPrice.toFixed(2),
            profit_pct: priceDiff.toFixed(2),
        },
    };
}
