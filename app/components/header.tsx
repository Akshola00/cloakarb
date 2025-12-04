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
    <header className="flex h-[60px] items-center justify-between border-b border-border bg-background px-4 lg:px-6 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-primary to-primary/70 font-bold text-primary-foreground shadow-lg shadow-primary/30">
          Z
        </div>
        <h1 className="text-xl font-bold text-foreground lg:text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">ZEC Shadow Trader</h1>
      </div>
      <p className="hidden text-sm text-muted-foreground md:block">
        AI-Agent for Private Cross-Chain Arbitrage Alerts
      </p>
      <div className="flex items-center gap-3">
        <Badge className="border-0 bg-primary/20 text-primary font-medium animate-pulse">Testnet Mode</Badge>
        <Button
          onClick={onConnectWallet}
          className={
            walletConnected
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
              : "bg-muted text-muted-foreground hover:bg-primary hover:text-black border border-border transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
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
