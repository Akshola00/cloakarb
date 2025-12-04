"use client"

import { useState, useEffect } from "react"
import { Header } from "@/app/components/header"
import { Sidebar } from "@/app/components/sidebar"
import { ChatPanel } from "@/app/components/chat-panel"
import { Footer } from "@/app/components/footer"
import type { ChatMessage, PriceScan, TxLog, Settings } from "@/lib/types"
import { parseWithFakeLLM } from "@/utils/parsePrompt"
import { getPrices } from "@/lib/prices"
import { initNear, createZecIntent, connectWallet, isWalletConnected, getAccountId } from "@/lib/near"

export default function Home() {
  // State
  const [walletConnected, setWalletConnected] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    autoExecute: false,
    targetChains: ["Zcash"],
  })
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [priceScans, setPriceScans] = useState<PriceScan[]>([])
  const [txLogs, setTxLogs] = useState<TxLog[]>([])
  const [nearAccount, setNearAccount] = useState<string | null>(null)

  // Fetch real-time prices
  useEffect(() => {
    const fetchAndUpdatePrices = async () => {
      try {
        const prices = await getPrices()
        const now = new Date()
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
        
        // Calculate arbitrage percentage (simple example: compare ZEC to ETH)
        const arbPercent = ((prices.zec - 82) / 82 * 100).toFixed(1)
        
        const newScan: PriceScan = {
          timestamp,
          zecPrice: prices.zec.toFixed(2),
          ethPrice: prices.eth.toFixed(2),
          solPrice: prices.sol.toFixed(2),
          arbPercent,
        }
        
        setPriceScans(prev => [newScan, ...prev].slice(0, 10)) // Keep last 10 scans
      } catch (error) {
        console.error('Failed to fetch prices:', error)
      }
    }

    // Fetch immediately on mount
    fetchAndUpdatePrices()

    // Then fetch every 15 seconds
    const interval = setInterval(fetchAndUpdatePrices, 15000)

    return () => clearInterval(interval)
  }, [])

  // Initialize NEAR wallet on mount
  useEffect(() => {
    const init = async () => {
      await initNear()
      // Check if wallet is already connected
      if (isWalletConnected()) {
        const accountId = await getAccountId()
        setNearAccount(accountId)
        setWalletConnected(true)
      }
    }
    init().catch(console.error)
  }, [])



  // Handlers
  const handleConnectWallet = async () => {
    try {
      if (walletConnected && nearAccount) {
        // Already connected, maybe show disconnect option
        setWalletConnected(false)
        setNearAccount(null)
      } else {
        // Show wallet connection modal
        await connectWallet()
        // After connection, update state
        setTimeout(async () => {
          if (isWalletConnected()) {
            const accountId = await getAccountId()
            setNearAccount(accountId)
            setWalletConnected(true)
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }
  const handleSettingsChange = (newSettings: Settings) => setSettings(newSettings)
  const handleRefreshData = () => console.log("Refreshing data...")
  const handleSubmitPrompt = async (prompt: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: prompt,
      timestamp: new Date(),
    }
    setChatHistory([...chatHistory, newMessage])
    
    // Simulate agent response
    setTimeout(async () => {
        const parsed = await parseWithFakeLLM(prompt)
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
  const handleExecuteSwap = async () => {
    try {
      const intent = await createZecIntent("0.01")
      
      // Add transaction log
      const newLog: TxLog = {
        id: Date.now().toString(),
        intent: "Arb ZEC/ETH",
        hash: intent.hash,
        privacy: "Shielded",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      
      setTxLogs(prev => [newLog, ...prev])
      
      console.log(`Intent created! Hash: ${intent.hash}`)
      console.log(`Privacy: shielded pool + NEAR Chain Signatures`)
      console.log(`Explorer: https://testnet.nearblocks.io/txns/${intent.hash}`)
    } catch (error) {
      console.error("Failed to execute swap:", error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Header walletConnected={walletConnected} nearAccount={nearAccount} onConnectWallet={handleConnectWallet} />
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
