# CyFuture AI - Blockchain-Secured AI Accountant

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-Web3.js-purple)](https://solana.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC)](https://tailwindcss.com/)

##  Overview

CyFuture AI is a cutting-edge, AI-powered financial platform that revolutionizes accounting and GST reconciliation through the power of blockchain technology and artificial intelligence. The platform combines advanced OCR capabilities, cryptographic verification, and decentralized storage to create an immutable, tamper-proof audit trail for all financial documents.

### Key Highlights

- **AI-Driven Automation**: Leverages Google Gemini AI for intelligent invoice data extraction
- **Blockchain Security**: Utilizes Solana blockchain for immutable transaction records
- **Decentralized Storage**: Stores documents on IPFS (InterPlanetary File System) for permanent, distributed access
- **GST Reconciliation**: Automated GST compliance and reconciliation tools
- **Real-time Analytics**: Interactive dashboards with financial insights
- **Multi-wallet Support**: Integrates with major Solana wallets (Phantom, Backpack, etc.)

## ✨ Features

###  AI-Powered OCR Processing

- **Intelligent Data Extraction**: Automatically extracts invoice details including:
  - Invoice numbers and dates
  - Vendor and buyer information
  - GST/GSTIN details
  - Line items with quantities and prices
  - Tax calculations and total amounts
- **Multi-format Support**: Processes JPG, PNG, and WebP images
- **Confidence Scoring**: Provides accuracy metrics for extracted data
- **Editable Results**: Review and modify extracted data before blockchain submission
- **Batch Processing Ready**: Architecture supports future multi-document processing

###  Blockchain Integration

- **Solana Blockchain**: Fast, low-cost transactions with cryptographic security
- **Immutable Records**: All transactions permanently recorded on-chain
- **Wallet Integration**: Seamless connection with Solana wallet adapters
- **Transaction Tracking**: Real-time transaction status and confirmation
- **Cryptographic Verification**: Every document hash is cryptographically secured

### IPFS Storage

- **Decentralized Storage**: Documents stored on IPFS via Pinata
- **Permanent Links**: Content-addressed storage ensures data permanence
- **Gateway Access**: Multiple IPFS gateways for reliable retrieval
- **Fallback Mechanisms**: Automatic failover to alternative IPFS providers
- **File Integrity**: Content hashing ensures document authenticity

### Dashboard & Analytics

- **Real-time Metrics**: Live financial data visualization
- **Interactive Charts**: Powered by Recharts for dynamic data exploration
- **Transaction History**: Complete audit trail of all operations
- **Invoice Management**: Centralized invoice tracking and status monitoring
- **Portfolio Overview**: Comprehensive financial health indicators
- **GST Reports**: Automated GST reconciliation and compliance reports

###  Modern UI/UX

- **Responsive Design**: Fully optimized for desktop, tablet, and mobile
- **Dark Mode**: System-aware theme switching
- **Smooth Animations**: Framer Motion powered transitions
- **Accessibility**: WCAG compliant with keyboard navigation
- **Interactive Components**: Radix UI primitives for robust interactions
- **Loading States**: Multi-step loaders with progress indicators

###  Security Features

- **Client-side Authentication**: Secure user session management
- **Wallet-based Auth**: Cryptographic authentication via Solana wallets
- **API Key Rotation**: Support for multiple Gemini API keys
- **Error Boundaries**: Graceful error handling and recovery
- **Service Worker Guards**: Enhanced PWA security
- **Environment Isolation**: Strict environment variable management

##  Architecture

### Technology Stack

#### Frontend Framework
- **Next.js 16.1.1**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript 5**: Strong typing for enhanced development

#### Blockchain & Web3
- **Solana Web3.js**: Solana blockchain interaction
- **Wallet Adapter**: Multi-wallet support (Phantom, Backpack, etc.)
- **SPL Token**: Solana token program integration

#### AI & Machine Learning
- **Google Gemini AI**: Advanced vision and language models
- **OCR Service**: Custom invoice data extraction pipeline
- **Multi-key Rotation**: Load balancing across API keys

#### Storage & Data
- **IPFS/Pinata**: Decentralized file storage
- **LocalStorage**: Client-side state persistence
- **Context API**: Global state management

#### UI & Styling
- **Tailwind CSS 4.1.9**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Advanced animations
- **Lucide Icons**: Modern icon library
- **Custom Components**: 50+ custom UI components

#### Development Tools
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS transformation
- **pnpm**: Fast, efficient package manager

### Project Structure

```
cyfuture-landingpage/
├── app/                          # Next.js app directory
│   ├── ai/                       # AI features and chat interface
│   ├── analytics/                # Analytics dashboard
│   ├── dashboard/                # Main dashboard
│   ├── goals/                    # Financial goals tracking
│   ├── gst/                      # GST reconciliation
│   ├── invoices/                 # Invoice management
│   ├── login/                    # Authentication pages
│   ├── ocr/                      # OCR processing interface
│   ├── portfolio/                # Portfolio management
│   ├── reports/                  # Financial reports
│   ├── settings/                 # User settings
│   ├── signup/                   # User registration
│   ├── transactions/             # Transaction history
│   ├── wallet/                   # Wallet management
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── ai/                      # AI-specific components
│   ├── cyfuture/                # Platform-specific components
│   ├── home/                    # Landing page components
│   ├── magicui/                 # Magic UI library
│   ├── AIAccountant.tsx         # AI accountant interface
│   ├── AppLayout.tsx            # Application layout
│   ├── AppNavigation.tsx        # Navigation component
│   ├── ExtractedDataDisplay.tsx # OCR results display
│   ├── HeroSection.tsx          # Landing hero
│   ├── IPFSLinks.tsx            # IPFS link components
│   ├── NavBar.tsx               # Navigation bar
│   ├── OCRUpload.tsx            # OCR upload interface
│   ├── TransactionResult.tsx    # Transaction display
│   ├── WalletProvider.tsx       # Wallet context provider
│   └── [50+ more components]
│
├── contexts/                     # React contexts
│   ├── AuthContext.tsx          # Authentication state
│   └── StorageContext.tsx       # Storage state management
│
├── hooks/                        # Custom React hooks
│   ├── useIpfs.ts               # IPFS operations
│   ├── useIpfsFallback.ts       # IPFS with fallbacks
│   ├── useSolanaAction.ts       # Solana interactions
│   ├── useSpeechRecognition.ts  # Voice input
│   └── use-mobile.ts            # Mobile detection
│
├── lib/                          # Utility libraries
│   ├── fonts.ts                 # Font configurations
│   ├── gemini.ts                # Gemini AI client
│   ├── ocr-config.ts            # OCR configuration
│   ├── ocr-service.ts           # OCR service layer
│   ├── theme.ts                 # Theme utilities
│   └── utils.ts                 # General utilities
│
├── public/                       # Static assets
│   └── [images, icons, etc.]
│
├── styles/                       # Additional styles
│
├── types/                        # TypeScript definitions
│
├── .env.local                    # Environment variables (not in repo)
├── .gitignore                   # Git ignore rules
├── components.json              # Component configuration
├── Dockerfile                   # Docker configuration
├── IPFS_FIX_GUIDE.md           # IPFS troubleshooting
├── next.config.mjs             # Next.js configuration
├── nginx.conf                  # Nginx configuration
├── OCR_IMPLEMENTATION.md       # OCR documentation
├── package.json                # Dependencies
├── pnpm-lock.yaml              # Lock file
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.js          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

### Data Flow Architecture

```
User Upload → OCR Processing → Data Extraction → User Review
                                                      ↓
                                                  Validation
                                                      ↓
                                    ┌─────────────────┴─────────────────┐
                                    ↓                                   ↓
                              IPFS Storage                      Solana Blockchain
                              (Document)                        (Metadata Hash)
                                    ↓                                   ↓
                              Content Hash  ←────────────────── Transaction Signature
                                    ↓
                              Verification & Retrieval
```

##  Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (or npm/yarn)
- **Solana Wallet**: Phantom, Backpack, or compatible wallet
- **API Keys**:
  - Google Gemini API key
  - Pinata JWT token (for IPFS)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hxrshxz/Cyfuture-LandingPage.git
cd Cyfuture-LandingPage
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# Google Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY_1=your_primary_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY_2=your_secondary_gemini_api_key  # Optional for rotation
NEXT_PUBLIC_GEMINI_MODEL=gemini-flash-latest                # Recommended for stable quota

# IPFS/Pinata Configuration
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs

# Solana Configuration (Optional - defaults to devnet)
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # or mainnet-beta, testnet
```

4. **Run the development server**
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

### Docker Deployment

**Note**: The Dockerfile in this repository is currently configured for a Vite-based build but the project uses Next.js. For Docker deployment with Next.js, you have two options:

**Option 1: Update the Dockerfile for Next.js**

Create a new Dockerfile:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Then build and run:
```bash
docker build -t cyfuture-ai .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GEMINI_API_KEY_1=your_key \
  -e NEXT_PUBLIC_PINATA_JWT=your_jwt \
  cyfuture-ai
```

**Option 2: Use the existing Dockerfile**

If you prefer to use the existing Dockerfile without modifications, ensure your environment variables use the VITE_ prefix during build.

##  API Keys Setup

### Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add to `.env.local`
5. (Optional) Create a second key for rotation

**Key Features:**
- Free tier: 60 requests per minute
- Multiple keys enable load balancing
- Automatic rotation prevents rate limiting

### Pinata IPFS Setup

1. Visit [Pinata Dashboard](https://app.pinata.cloud/)
2. Create an account or sign in
3. Navigate to "API Keys"
4. Click "New Key"
5. Enable required permissions:
   - ✅ `pinFileToIPFS` - Upload files
   - ✅ `pinJSONToIPFS` - Upload JSON
   - ✅ `userPinnedDataTotal` - Check usage
6. Copy the JWT token and add to `.env.local`

**Troubleshooting:** See [IPFS_FIX_GUIDE.md](IPFS_FIX_GUIDE.md) for detailed troubleshooting

##  Usage Guide

### Invoice Processing Workflow

1. **Connect Wallet**
   - Click "Connect Wallet" in the dashboard
   - Select your preferred Solana wallet
   - Approve the connection

2. **Upload Invoice**
   - Navigate to Dashboard or OCR page
   - Drag & drop an invoice image or click to browse
   - Supported formats: JPG, PNG, WebP (max 20MB)

3. **Review Extracted Data**
   - AI automatically extracts invoice details
   - Review all fields for accuracy
   - Edit any incorrect information
   - Check validation warnings

4. **Store on Blockchain**
   - Click "Store on Blockchain"
   - Confirm transaction in your wallet
   - Wait for confirmation (typically 1-2 seconds)

5. **View Results**
   - Access document via IPFS link
   - View transaction on Solana Explorer
   - Download or share permanent links

### GST Reconciliation

1. Navigate to the GST section
2. Upload GST invoices or import from dashboard
3. Review automated reconciliation reports
4. Export reports for compliance

### AI Accountant

1. Navigate to AI chat interface
2. Ask questions about your financial data
3. Get AI-powered insights and recommendations
4. Export conversation history

## 🎨 Customization

### Theme Configuration

The platform supports light and dark modes. Customize themes in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      // Add your custom colors
    }
  }
}
```

### Component Customization

All components are built with Radix UI and can be customized via:
- Tailwind utility classes
- CSS variables in `globals.css`
- Component props

##  Testing

```bash
# Run linter
pnpm lint

# Type checking
pnpm build
```

##  Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker

See the "Docker Deployment" section above for detailed containerization instructions.

### Self-Hosted

```bash
# Build
pnpm build

# Start the production server
pnpm start
```

For standalone deployment:
```bash
# Enable standalone output in next.config.mjs
# Then build and run:
pnpm build
node .next/standalone/server.js
```

##  Configuration Files

- **next.config.mjs**: Next.js configuration
- **tailwind.config.js**: Tailwind CSS customization
- **tsconfig.json**: TypeScript compiler options
- **components.json**: shadcn/ui component configuration
- **postcss.config.mjs**: PostCSS plugins

##  Additional Documentation

- [OCR Implementation Guide](OCR_IMPLEMENTATION.md) - Detailed OCR setup and usage
- [IPFS Troubleshooting](IPFS_FIX_GUIDE.md) - IPFS and Pinata configuration

##  Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write descriptive commit messages
- Add comments for complex logic
- Update documentation for new features

## Security

- Never commit `.env.local` or API keys to the repository
- Use environment variables for all sensitive data
- Keep dependencies updated
- Report security vulnerabilities privately

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Solana Foundation**: Blockchain infrastructure
- **Google Gemini AI**: OCR and AI capabilities
- **Pinata**: IPFS pinning service
- **Vercel**: Deployment and hosting
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework

## Support

For questions, issues, or feature requests:

- Issues: [GitHub Issues](https://github.com/hxrshxz/Cyfuture-LandingPage/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/hxrshxz/Cyfuture-LandingPage/discussions)

## Roadmap

### Upcoming Features

- [ ] **PDF Support**: OCR processing for PDF documents
- [ ] **Batch Processing**: Multi-document upload and processing
- [ ] **Mobile App**: React Native mobile application
- [ ] **API Endpoints**: REST API for programmatic access
- [ ] **Multi-language**: Support for additional languages
- [ ] **Advanced Analytics**: ML-powered financial forecasting
- [ ] **Team Collaboration**: Multi-user accounts and permissions
- [ ] **Export Features**: Export to Excel, CSV, and PDF
- [ ] **Integration**: QuickBooks, Xero, and other accounting software
- [ ] **Audit Trail**: Enhanced compliance and audit features

---

**Built with ❤️ by the CyFuture AI Team**

**GitHub**: [@hxrshxz](https://github.com/hxrshxz)