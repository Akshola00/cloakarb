export async function getPrices() {
    const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=zcash,ethereum,solana&vs_currencies=usd"
    );
    const data = await res.json();
    return {
        zec: data.zcash.usd,
        eth: data.ethereum.usd,
        sol: data.solana.usd,
    };
}
