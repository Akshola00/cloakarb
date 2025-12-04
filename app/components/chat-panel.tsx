"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Send, Activity, Target, Shield, ArrowRight, AlertCircle } from "lucide-react"
import type { ChatMessage } from "@/lib/types"
import { validateMessage } from "@/utils/validateMessage"

interface ChatPanelProps {
  chatHistory: ChatMessage[]
  onSubmitPrompt: (prompt: string) => void
  onExecuteSwap: () => Promise<void>
}

const exampleAgentMessage: ChatMessage = {
  id: "example-1",
  type: "agent",
  content: "Alert me if ZEC arbitrages >2% vs ETH on Solana, spend privately",
  timestamp: new Date(),
  parsedIntent: {
    action: "monitor_arbitrage",
    threshold: "2%",
    baseAsset: "ZEC",
    compareAsset: "ETH",
    targetChain: "Solana",
    privacy: "shielded",
  },
  arbitrageData: [
    { chain: "Zcash", price: "82.45", difference: "+2.3%" },
    { chain: "Ethereum", price: "80.56", difference: "0%" },
    { chain: "Solana", price: "81.12", difference: "+0.7%" },
  ],
}

export function ChatPanel({ chatHistory, onSubmitPrompt, onExecuteSwap }: ChatPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      const validation = validateMessage(prompt)
      
      if (validation.isGreeting) {
        // Handle greeting
        setIsLoading(true)
        onSubmitPrompt(prompt)
        setPrompt("")
        setTimeout(() => setIsLoading(false), 500)
        return
      }
      
      if (!validation.isValid) {
        // Show error message
        setIsLoading(true)
        onSubmitPrompt(prompt)
        setPrompt("")
        setTimeout(() => setIsLoading(false), 500)
        return
      }
      
      // Valid message
      setIsLoading(true)
      onSubmitPrompt(prompt)
      setPrompt("")
      setTimeout(() => setIsLoading(false), 1500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const displayMessages = chatHistory.length === 0 ? [exampleAgentMessage] : chatHistory

  return (
    <div className="flex flex-1 flex-col border-r border-border lg:w-[70%]">
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto p-4"
        style={{ maxHeight: "calc(100vh - 60px - 50px - 140px)" }}
      >
        {/* Welcome message when showing example */}
        {chatHistory.length === 0 && (
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground">Example detection below. Type a prompt to start monitoring.</p>
          </div>
        )}

        {displayMessages.map((message) => (
          <div key={message.id} className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            {message.type === "user" ? (
              <div className="flex justify-end mb-4">
                <Card className="max-w-[70%] border-0 bg-secondary p-3 shadow-sm">
                  <p className="text-secondary-foreground text-sm">{message.content}</p>
                </Card>
              </div>
            ) : message.content.includes("How can I help") ? (
              // Greeting response
              <div className="flex justify-start mb-4">
                <Card className="max-w-[85%] border border-primary/30 bg-card/50 p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground mb-2">{message.content}</p>
                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-border">
                        <span className="font-medium">Example:</span> "Alert me if ZEC arbitrages &gt;2% vs ETH on Solana, spend privately"
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : message.content.includes("couldn't process") ? (
              // Error response
              <div className="flex justify-start mb-4">
                <Card className="max-w-[85%] border border-destructive/30 bg-card/50 p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20 flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <p className="text-foreground mb-2">{message.content}</p>
                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-border">
                        <span className="font-medium">Example:</span> "Alert me if ZEC arbitrages &gt;2% vs ETH on Solana, spend privately"
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              // Success response - horizontal layout
              <div className="flex justify-start mb-4">
                <Card className="w-full border border-border bg-card p-4 shadow-lg hover:shadow-xl transition-shadow">
                {/* Parsed Intent - Horizontal Layout */}
                {message.parsedIntent && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                        <Activity className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Action: {message.parsedIntent.action.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-muted-foreground">Threshold</span>
                          <span className="text-sm font-medium">{message.parsedIntent.threshold}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-muted-foreground">Privacy</span>
                          <span className="text-sm font-medium capitalize">{message.parsedIntent.privacy}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="bg-muted font-mono text-xs">
                            {message.parsedIntent.baseAsset}
                          </Badge>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <Badge variant="outline" className="bg-muted font-mono text-xs">
                            {message.parsedIntent.compareAsset}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">on</span>
                        <Badge variant="secondary" className="text-xs">
                          {message.parsedIntent.targetChain}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Arbitrage Table */}
                {message.arbitrageData && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm text-muted-foreground">Arbitrage Opportunities:</p>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">Chain</TableHead>
                          <TableHead className="text-muted-foreground">Price (USD)</TableHead>
                          <TableHead className="text-muted-foreground">Difference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {message.arbitrageData.map((row, idx) => (
                          <TableRow key={idx} className="border-border">
                            <TableCell className="text-card-foreground">{row.chain}</TableCell>
                            <TableCell className="text-card-foreground">${row.price}</TableCell>
                            <TableCell
                              className={row.difference.startsWith("+") ? "text-primary" : "text-card-foreground"}
                            >
                              {row.difference}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Privacy Badge */}
                <div className="mb-4 flex items-center gap-2">
                  <Badge className="border-0 bg-primary/20 text-primary">Shielded Pool Enabled</Badge>
                </div>

                {/* Execute Button */}
                <Button
                  onClick={async () => {
                    setIsExecuting(true)
                    await onExecuteSwap()
                    setTimeout(() => setIsExecuting(false), 1000)
                  }}
                  disabled={isExecuting}
                  className="w-full bg-primary text-black font-medium hover:bg-primary/90 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                >
                  {isExecuting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      <span>Executing...</span>
                    </div>
                  ) : (
                    "Execute Private Swap"
                  )}
                </Button>
              </Card>
            </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-background p-4 pb-3">
        <div className="flex gap-3">
          <Textarea
            placeholder="Alert me if ZEC arbitrages >2% vs ETH on Solana, spend privately"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="min-h-[60px] max-h-[120px] flex-1 resize-none border-border bg-muted text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !prompt.trim()}
            className="h-[60px] w-[60px] rounded-full bg-primary p-0 text-black hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 shadow-lg shadow-primary/30 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}
