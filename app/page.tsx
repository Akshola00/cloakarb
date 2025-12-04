"use client"

import { useState } from "react"
import { Header } from "@/app/components/header"
import { Sidebar } from "@/app/components/sidebar"
import { ChatPanel } from "@/app/components/chat-panel"
import { Footer } from "@/app/components/footer"
import type { ChatMessage, PriceScan, TxLog, Settings } from "@/lib/types"
import { parseWithFakeLLM } from "@/utils/parsePrompt"

export default function Home() {
  // State
  const [walletConnected, setWalletConnected] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    autoExecute: false,
    targetChains: ["Zcash"],
  })
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  // Mock Data
  const priceScans: PriceScan[] = [
    { timestamp: "10:45:02", zecPrice: "82.45", ethPrice: "2250.10", solPrice: "81.12", arbPercent: "2.3" },
    { timestamp: "10:44:30", zecPrice: "82.40", ethPrice: "2248.50", solPrice: "80.90", arbPercent: "0.5" },
    { timestamp: "10:44:00", zecPrice: "82.35", ethPrice: "2245.20", solPrice: "80.85", arbPercent: "-0.2" },
  ]

  const txLogs: TxLog[] = [
    { id: "1", intent: "Arb ZEC/ETH", hash: "0x7f...3a2b", privacy: "Shielded", timestamp: "10:42" },
  ]

  // Handlers
  const handleConnectWallet = () => setWalletConnected(!walletConnected)
  const handleSettingsChange = (newSettings: Settings) => setSettings(newSettings)
  const handleRefreshData = () => console.log("Refreshing data...")
  const handleSubmitPrompt = (prompt: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: prompt,
      timestamp: new Date(),
    }
    setChatHistory([...chatHistory, newMessage])
    
    // Simulate agent response
    setTimeout(() => {
        const parsed = parseWithFakeLLM(prompt)
        const isProfitable = parsed.prices.profit_pct && parseFloat(parsed.prices.profit_pct) > 0

        const agentResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "agent",
            content: isProfitable 
                ? `I found a profitable arbitrage opportunity for ${parsed.intent.to}!` 
                : `Monitoring for ${parsed.intent.to} arbitrage opportunities...`,
            timestamp: new Date(),
            parsedIntent: {
                action: parsed.intent.action,
                threshold: parsed.intent.threshold + "%",
                baseAsset: parsed.intent.from.toUpperCase(),
                compareAsset: parsed.intent.to === "ethereum" ? "ETH" : "SOL",
                targetChain: parsed.intent.to.charAt(0).toUpperCase() + parsed.intent.to.slice(1),
                privacy: "shielded"
            },
            arbitrageData: [
                { 
                    chain: "Zcash", 
                    price: parsed.prices.zcash_native, 
                    difference: "0%" 
                },
                { 
                    chain: parsed.intent.to.charAt(0).toUpperCase() + parsed.intent.to.slice(1), 
                    price: parsed.prices.zcash_bridged, 
                    difference: (parseFloat(parsed.prices.profit_pct || "0") > 0 ? "+" : "") + (parsed.prices.profit_pct || "0") + "%"
                }
            ]
        }
        setChatHistory(prev => [...prev, agentResponse])
    }, 1000)
  }
  const handleExecuteSwap = () => console.log("Executing swap...")

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Header walletConnected={walletConnected} onConnectWallet={handleConnectWallet} />
      <div className="flex flex-1 overflow-hidden">
        <ChatPanel 
          chatHistory={chatHistory} 
          onSubmitPrompt={handleSubmitPrompt} 
          onExecuteSwap={handleExecuteSwap} 
        />
        <Sidebar 
          priceScans={priceScans} 
          txLogs={txLogs} 
          settings={settings} 
          onSettingsChange={handleSettingsChange} 
          onRefreshData={handleRefreshData} 
        />
      </div>
      <Footer />
    </div>
  )
}
