export interface ChatMessage {
  id: string
  type: "user" | "agent"
  content: string
  timestamp: Date
  parsedIntent?: ParsedIntent
  arbitrageData?: ArbitrageRow[]
}

export interface ParsedIntent {
  action: string
  threshold: string
  baseAsset: string
  compareAsset: string
  targetChain: string
  privacy: string
}

export interface ArbitrageRow {
  chain: string
  price: string
  difference: string
}

export interface PriceScan {
  timestamp: string
  zecPrice: string
  ethPrice: string
  solPrice: string
  arbPercent: string
}

export interface TxLog {
  id: string
  intent: string
  hash: string
  privacy: string
  timestamp: string
}

export interface Settings {
  apiKey: string
  autoExecute: boolean
  targetChains: string[]
}
