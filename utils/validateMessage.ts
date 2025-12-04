// Validation helper for chat messages
export function validateMessage(message: string): {
    isValid: boolean;
    isGreeting: boolean;
    errorMessage?: string;
} {
    const lower = message.toLowerCase().trim();

    // Check for greetings
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo'];
    if (greetings.some(g => lower === g || lower.startsWith(g + ' ') || lower.startsWith(g + ','))) {
        return {
            isValid: false,
            isGreeting: true,
        };
    }

    // Check for required elements
    const coins = ['solana', 'sol', 'ethereum', 'eth', 'zcash', 'zec'];
    const hasCoins = coins.filter(coin => lower.includes(coin)).length >= 2;
    const hasPercentage = /\d+\.?\d*\s*%/.test(lower);

    if (!hasCoins || !hasPercentage) {
        return {
            isValid: false,
            isGreeting: false,
            errorMessage: "I couldn't process your request. Please include 2 coins (SOL/Solana, ETH/Ethereum, ZEC/Zcash) and a percentage threshold.",
        };
    }

    return {
        isValid: true,
        isGreeting: false,
    };
}
