"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { PriceScan, TxLog, Settings } from "@/lib/types"

interface SidebarProps {
  priceScans: PriceScan[]
  txLogs: TxLog[]
  settings: Settings
  onSettingsChange: (settings: Settings) => void
  onRefreshData: () => void
}

export function Sidebar({ priceScans, txLogs, settings, onSettingsChange, onRefreshData }: SidebarProps) {
  return (
    <aside className="flex w-full flex-col border-l border-border bg-sidebar p-4 lg:w-[30%]">
      {/* Real-Time Scans */}
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold text-sidebar-foreground">Real-Time Scans</h3>
        <div className="max-h-[200px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-sidebar-border">
                <TableHead className="text-xs text-muted-foreground">Time</TableHead>
                <TableHead className="text-xs text-muted-foreground">ZEC</TableHead>
                <TableHead className="text-xs text-muted-foreground">ETH</TableHead>
                <TableHead className="text-xs text-muted-foreground">SOL</TableHead>
                <TableHead className="text-xs text-muted-foreground">Arb %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceScans.map((scan, idx) => (
                <TableRow key={idx} className="border-sidebar-border">
                  <TableCell className="py-1 text-xs text-sidebar-foreground">{scan.timestamp}</TableCell>
                  <TableCell className="py-1 text-xs text-sidebar-foreground">${scan.zecPrice}</TableCell>
                  <TableCell className="py-1 text-xs text-sidebar-foreground">${scan.ethPrice}</TableCell>
                  <TableCell className="py-1 text-xs text-sidebar-foreground">${scan.solPrice}</TableCell>
                  <TableCell
                    className={`py-1 text-xs ${
                      Number.parseFloat(scan.arbPercent) > 0 ? "text-primary" : "text-sidebar-foreground"
                    }`}
                  >
                    {scan.arbPercent}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Separator className="my-3 bg-sidebar-border" />

      {/* Tx Simulation Log */}
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold text-sidebar-foreground">Tx Simulation Log</h3>
        <div className="max-h-[200px] space-y-2 overflow-y-auto">
          {txLogs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No transactions yet</p>
          ) : (
            txLogs.map((log) => (
              <Card key={log.id} className="border-sidebar-border bg-sidebar-accent p-2">
                <p className="text-xs text-sidebar-foreground">
                  <span className="font-medium">Intent:</span> {log.intent}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  <span className="font-medium font-sans">Hash:</span> {log.hash}
                </p>
                <p className="text-xs text-primary">
                  <span className="font-medium text-sidebar-foreground">Privacy:</span> {log.privacy}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>

      <Separator className="my-3 bg-sidebar-border" />

      {/* Settings */}
      <div className="flex-1">
        <h3 className="mb-3 text-sm font-semibold text-sidebar-foreground">Settings</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey" className="text-xs text-muted-foreground">
              CoinGecko API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key"
              value={settings.apiKey}
              onChange={(e) => onSettingsChange({ ...settings, apiKey: e.target.value })}
              className="mt-1 border-sidebar-border bg-sidebar text-sidebar-foreground"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoExecute" className="text-xs text-muted-foreground">
              Auto-Execute on Alert
            </Label>
            <Switch
              id="autoExecute"
              checked={settings.autoExecute}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, autoExecute: checked })}
            />
          </div>
          <div>
            <Label htmlFor="targetChain" className="text-xs text-muted-foreground">
              Target Chain
            </Label>
            <Select
              value={settings.targetChains[0]}
              onValueChange={(value) => onSettingsChange({ ...settings, targetChains: [value] })}
            >
              <SelectTrigger className="mt-1 border-sidebar-border bg-sidebar text-sidebar-foreground">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Zcash">Zcash</SelectItem>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Solana">Solana</SelectItem>
                <SelectItem value="NEAR">NEAR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button onClick={onRefreshData} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Refresh Data
      </Button>
    </aside>
  )
}
