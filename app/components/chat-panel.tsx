"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Send } from "lucide-react"
import type { ChatMessage } from "@/lib/types"

interface ChatPanelProps {
  chatHistory: ChatMessage[]
  onSubmitPrompt: (prompt: string) => void
  onExecuteSwap: () => void
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
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmitPrompt(prompt)
      setPrompt("")
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
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            {message.type === "user" ? (
              <Card className="max-w-[80%] border-0 bg-secondary p-3">
                <p className="text-secondary-foreground">{message.content}</p>
              </Card>
            ) : (
              <Card className="max-w-[90%] border border-border bg-card p-4">
                {/* Parsed Intent */}
                {message.parsedIntent && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm text-muted-foreground">Parsed Intent:</p>
                    <pre className="overflow-x-auto rounded bg-muted p-3 font-mono text-sm">
                      <code>
                        {`{`}
                        {"\n"}
                        {"  "}
                        <span className="text-primary">"action"</span>: "{message.parsedIntent.action}",
                        {"\n"}
                        {"  "}
                        <span className="text-primary">"threshold"</span>: "{message.parsedIntent.threshold}",
                        {"\n"}
                        {"  "}
                        <span className="text-primary">"baseAsset"</span>: "{message.parsedIntent.baseAsset}",
                        {"\n"}
                        {"  "}
                        <span className="text-primary">"compareAsset"</span>: "{message.parsedIntent.compareAsset}",
                        {"\n"}
                        {"  "}
                        <span className="text-primary">"targetChain"</span>: "{message.parsedIntent.targetChain}",
                        {"\n"}
                        {"  "}
                        <span className="text-primary">"privacy"</span>: "{message.parsedIntent.privacy}"{"\n"}
                        {`}`}
                      </code>
                    </pre>
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
                  onClick={onExecuteSwap}
                  className="w-full bg-primary text-black font-medium hover:bg-primary/90"
                >
                  Execute Private Swap
                </Button>
              </Card>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-background p-4">
        <div className="flex gap-3">
          <Textarea
            placeholder="Alert me if ZEC arbitrages >2% vs ETH on Solana, spend privately"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] max-h-[120px] flex-1 resize-none border-border bg-muted text-foreground placeholder:text-muted-foreground"
          />
          <Button onClick={handleSubmit} className="h-auto bg-primary px-4 text-black hover:bg-primary/90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}
