"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  walletConnected: boolean
  nearAccount?: string | null
  onConnectWallet: () => void
}

export function Header({ walletConnected, nearAccount, onConnectWallet }: HeaderProps) {
  return (
    <header className="flex h-[60px] items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-bold text-primary-foreground">
          Z
        </div>
        <h1 className="text-xl font-bold text-foreground lg:text-2xl">ZEC Shadow Trader</h1>
      </div>
      <p className="hidden text-sm text-secondary-foreground md:block">
        AI-Agent for Private Cross-Chain Arbitrage Alerts
      </p>
      <div className="flex items-center gap-3">
        <Badge className="border-0 bg-primary text-black font-medium">Testnet Mode</Badge>
        <Button
          onClick={onConnectWallet}
          className={
            walletConnected
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground hover:bg-primary hover:text-black"
          }
        >
          {walletConnected && nearAccount 
            ? `${nearAccount.slice(0, 12)}...${nearAccount.slice(-4)}` 
            : walletConnected 
            ? "Connected" 
            : "Connect Wallet"}
        </Button>
      </div>
    </header>
  )
}
