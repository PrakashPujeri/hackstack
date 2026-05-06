# RiskPilot AI - Frontend

Modern React frontend for the Hedge Fund Risk Modeling & Semi-Automated Trading System.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Icon library
- **Recharts** - Data visualization charts
- **Axios** - HTTP client for API calls

## Features

- **Dashboard** - Portfolio overview with key metrics
- **Performance Analysis** - Detailed performance charts and benchmark comparison
- **Risk Analysis** - Comprehensive risk metrics (VaR, drawdown, volatility, Sharpe ratio)
- **Trade History** - Complete trade logs with filtering and search
- **API Key Management** - Secure management of external API keys
- **Settings** - Portfolio constraints and risk parameters configuration
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your backend URL:
```
VITE_API_URL=http://localhost:8000
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Input, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   ├── Navigation.jsx   # Main navigation bar
│   ├── ApiKeyManager.jsx # API key management
│   └── Settings.jsx     # Settings page
├── pages/
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Performance.jsx  # Performance analysis
│   ├── Risk.jsx         # Risk analysis
│   └── Trades.jsx       # Trade history
├── lib/
│   ├── api.js           # API client
│   └── utils.js         # Utility functions
├── App.jsx              # Main app component with routing
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## API Integration

The frontend communicates with the backend via REST API endpoints. All API calls are handled through the `api.js` client:

- `portfolioAPI` - Portfolio data and constraints
- `riskAPI` - Risk metrics and calculations
- `tradingAPI` - Trading signals and trade history
- `dataAPI` - Market data and features
- `apiKeysAPI` - API key management

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:8000)

## Contributing

When adding new features:
1. Create new components in appropriate directories
2. Follow the existing component structure and naming conventions
3. Use TailwindCSS for styling
4. Ensure responsive design with mobile-first approach
5. Add proper error handling and loading states
6. Update this README if needed

## License

Part of the RiskPilot AI project for Code2Create Challenge.
