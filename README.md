# 🌙 ZEC Shadow Trader

> AI-Powered Private Cross-Chain Arbitrage Alert System

An intelligent arbitrage monitoring platform that combines real-time price tracking, natural language processing, and privacy-preserving cross-chain transactions using NEAR Chain Signatures and Zcash shielded pools.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![NEAR](https://img.shields.io/badge/NEAR-Testnet-green)

---

## 🎯 The Problem

Traditional arbitrage trading faces three critical challenges:

1. **Lack of Privacy**: On-chain transactions expose trading strategies and wallet balances
2. **Manual Monitoring**: Traders must constantly watch multiple exchanges for opportunities
3. **Complex Execution**: Cross-chain arbitrage requires technical expertise and multiple tools

## 💡 Our Solution

ZEC Shadow Trader is an AI-powered platform that:

- **Monitors** real-time price differences across chains (Zcash, Ethereum, Solana)
- **Alerts** users when profitable arbitrage opportunities exceed their threshold
- **Executes** private cross-chain swaps using NEAR Chain Signatures + Zcash shielded pools
- **Simplifies** the entire process through natural language commands

---

## ✨ Key Features

### 🤖 Natural Language Interface
- Chat-based interaction for setting up arbitrage alerts
- Smart validation with helpful error messages
- Example: *"Alert me if ZEC arbitrages >2% vs ETH on Solana, spend privately"*

### 📊 Real-Time Price Monitoring
- Live price feeds from CoinGecko API
- Automatic 15-second refresh intervals
- Visual indicators for profitable opportunities

### 🔒 Privacy-First Execution
- NEAR Chain Signatures for cross-chain operations
- Zcash shielded pools for private transactions
- No exposure of trading strategies or balances

### 🎨 Modern UI/UX
- Dark mode with green accent theme
- Smooth animations and transitions
- Loading states and visual feedback
- Responsive design for all devices

---

## 🏗️ Architecture

### Tech Stack

**Frontend**
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful component library

**Blockchain Integration**
- **NEAR Wallet Selector** - Multi-wallet support
- **Defuse Protocol SDK** - Cross-chain intents
- **NEAR Chain Signatures** - Multi-chain transaction signing

**Data Sources**
- **CoinGecko API** - Real-time cryptocurrency prices

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat Panel   │  │ Price Scanner│  │  Tx Logs     │      │
│  │ (NLP Input)  │  │ (Real-time)  │  │  (History)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Validation   │  │ Price Parser │  │ Intent       │      │
│  │ Engine       │  │              │  │ Creator      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Integration Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ CoinGecko    │  │ NEAR Wallet  │  │ Defuse       │      │
│  │ API          │  │ Selector     │  │ Protocol     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ NEAR Chain   │  │ Zcash        │  │ Ethereum/    │      │
│  │ Signatures   │  │ Shielded     │  │ Solana       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 How It Works

### 1. **User Sets Alert**
```
User: "Alert me if ZEC arbitrages >2% vs ETH on Solana, spend privately"
```
- Input validated for coin pairs and threshold
- Intent parsed using NLP-style pattern matching
- Alert configured in the system

### 2. **Real-Time Monitoring**
```
Price Scanner → CoinGecko API → Price Comparison → Opportunity Detection
```
- Fetches live prices every 15 seconds
- Calculates arbitrage percentages
- Displays opportunities in real-time table

### 3. **Opportunity Detection**
```
ZEC (Native): $82.45
ZEC (Bridged): $84.35
Arbitrage: +2.3% ✅ (Threshold: >2%)
```
- Compares native vs bridged prices
- Highlights profitable opportunities
- Shows detailed breakdown

### 4. **Private Execution**
```
User → NEAR Wallet → Chain Signatures → Zcash Shielded Pool → Swap
```
- User clicks "Execute Private Swap"
- NEAR wallet signs the transaction
- Chain Signatures enable cross-chain operation
- Zcash shielded pool ensures privacy

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- NEAR Testnet account (for wallet connection)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/isaac/cloakarb.git
cd cloakarb
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Run development server**
```bash
pnpm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Usage

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Set Alert**: Type your arbitrage alert in the chat
   - Example: *"Alert me if ZEC arbitrages >2% vs ETH on Solana, spend privately"*
3. **Monitor**: Watch the real-time price scanner for opportunities
4. **Execute**: Click "Execute Private Swap" when opportunity appears

---

## 📁 Project Structure

```
cloakarb/
├── app/
│   ├── components/
│   │   ├── chat-panel.tsx      # Chat interface with NLP
│   │   ├── header.tsx          # Navigation and wallet
│   │   ├── sidebar.tsx         # Price scanner & logs
│   │   └── footer.tsx          # Footer component
│   ├── globals.css             # Global styles & theme
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main application
├── components/ui/              # Shadcn UI components
├── lib/
│   ├── near.ts                 # NEAR wallet integration
│   ├── prices.ts               # CoinGecko API client
│   └── types.ts                # TypeScript definitions
├── utils/
│   ├── parsePrompt.ts          # Intent parsing logic
│   └── validateMessage.ts      # Input validation
└── public/                     # Static assets
```


## 🛠️ Built With

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS | Utility-first styling |
| NEAR Protocol | Blockchain infrastructure |
| Defuse Protocol | Cross-chain intents |
| CoinGecko API | Real-time price data |
| Shadcn/ui | Component library |

---

## 🎯 Future Enhancements

- [ ] Multi-chain support (add more chains)
- [ ] Historical arbitrage analytics
- [ ] Automated execution with user-defined rules
- [ ] Portfolio tracking
- [ ] Mobile app (React Native)
- [ ] Advanced charting and visualization
- [ ] Social features (share strategies)
- [ ] Mainnet deployment

---

## 📊 Performance

- **Price Updates**: 15-second intervals
- **Response Time**: <500ms for validation
- **UI Animations**: 60 FPS smooth transitions
- **Bundle Size**: Optimized with Next.js

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NEAR Protocol** - For Chain Signatures technology
- **Zcash** - For privacy-preserving shielded pools
- **Defuse Protocol** - For cross-chain intent infrastructure
- **CoinGecko** - For reliable price data API
- **Vercel** - For Next.js framework and hosting

---

## 📞 Contact

Project Link: [https://github.com/isaac/cloakarb](https://github.com/isaac/cloakarb)

---

<div align="center">

**Made with ❤️ for the future of private DeFi**

[Demo](https://your-demo-link.vercel.app) • [Documentation](https://docs.link) • [Report Bug](https://github.com/isaac/cloakarb/issues)

</div>
