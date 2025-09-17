# MockRWAToken Faucet with MetaMask Integration

A modern, user-friendly faucet for the Pruv Network Testnet. Instantly mint 10 MockRWATokens to any Ethereum address with seamless MetaMask integration and human verification.

---

## 🚀 Features

- **MetaMask Integration:** Connect and interact with your wallet effortlessly.
- **Automatic Network Switching:** Switch to the Pruv Network Testnet with one click.
- **Token Minting:** Mint 10 MockRWATokens to any Ethereum address.
- **Human Verification:** Simple checkbox to prevent abuse.
- **Transaction Feedback:** Real-time status updates and explorer links.
- **Responsive UI:** Built with Tailwind CSS for a sleek experience.

---

## 🛠️ Tech Stack

- **React** (with Vite)
- **TypeScript**
- **ethers.js**
- **Tailwind CSS**

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/rawfaucet.git
cd rawfaucet
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables:**

- Copy `.env.example` to `.env` and update values as needed.

4. **Start the development server:**

```bash
npm run dev
# or
yarn dev
```

5. **Open in browser:**  
   Visit [http://localhost:5173](http://localhost:5173)

---

## 💡 Usage

1. Connect your MetaMask wallet.
2. Enter the recipient Ethereum address.
3. Check the "I am human" box.
4. Click **Request Funds**.
5. Confirm the transaction in MetaMask.
6. View transaction status and explorer link.

---

## 📁 Project Structure

- `App.tsx` — Main UI
- `Transaction.tsx` — Wallet and transaction logic
- `abi.ts` — MockRWAToken ABI
- `constants.ts` — Network constants
- `images.ts` — App images

---

## 📄 License

[MIT](LICENSE)
