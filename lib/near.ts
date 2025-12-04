"use client"

import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import type { WalletSelector, AccountState } from "@near-wallet-selector/core";
import { IntentsSDK, createIntentSignerNearKeyPair } from "@defuse-protocol/intents-sdk";
import { KeyPair } from "near-api-js";

let selector: WalletSelector | null = null;
let modal: any = null;
let intentsSDK: IntentsSDK | null = null;

export async function initNear() {
    try {
        // Initialize NEAR Wallet Selector
        selector = await setupWalletSelector({
            network: "testnet",
            modules: [setupMyNearWallet()],
        });

        // Setup modal for wallet selection
        modal = setupModal(selector, {
            contractId: "intents.testnet",
        });

        console.log("NEAR wallet selector initialized");
    } catch (error) {
        console.error("Failed to initialize NEAR wallet:", error);
    }
}

export async function connectWallet() {
    if (!modal) {
        throw new Error("NEAR wallet not initialized. Call initNear() first.");
    }

    modal.show();
}

export async function createZecIntent(amountZec: string) {
    if (!selector) {
        throw new Error("NEAR wallet not initialized. Call initNear() first.");
    }

    const wallet = await selector.wallet();
    const accounts = await wallet.getAccounts();

    if (accounts.length === 0) {
        // Show wallet connection modal
        if (modal) {
            modal.show();
        }
        throw new Error("No wallet connected. Please connect your wallet first.");
    }

    try {
        const mockIntent = {
            chain: "zcash",
            action: "transfer",
            amount: amountZec,
            recipient: "tutest1rmq2qpz6dvaxj6z5cdkh4sft6hlfgyptpaldeve9j083d4md57jk0rm9j529gen6m8e7a54my79jzat6y3mru2ulyykk9ajyvnx962vvqqdnørzgs9nz4jmml5ykj6t3p4k9qq587nqhduq7Lgapysvjckn0f96zqdwdvx2fujr47lf6j78mgkjx4kp8un26czxxvyuØ2cr562yvn8p",
            privacy: "shielded",
            hash: `0x${Math.random().toString(16).slice(2, 14)}...${Math.random().toString(16).slice(2, 6)}`,
            timestamp: new Date().toISOString(),
            accountId: accounts[0].accountId,
        };

        console.log("Intent created with account:", accounts[0].accountId);
        return mockIntent;
    } catch (error) {
        console.error("Failed to create intent:", error);
        throw error;
    }
}

export function isWalletConnected(): boolean {
    if (!selector) return false;
    return selector.isSignedIn();
}

export async function getAccountId(): Promise<string | null> {
    if (!selector) return null;

    try {
        const wallet = await selector.wallet();
        const accounts = await wallet.getAccounts();
        return accounts.length > 0 ? accounts[0].accountId : null;
    } catch {
        return null;
    }
}

export async function disconnectWallet() {
    if (!selector) return;

    const wallet = await selector.wallet();
    await wallet.signOut();
}
