# Meme Coin Intelligence & Trading Tool

A comprehensive system for analyzing meme coins through social media monitoring, on-chain analysis, and AI-powered insights.

## 🚀 Features

- Real-time social media monitoring (Twitter, Reddit, Discord, Telegram)
- AI-powered scam detection using GPT-4
- On-chain wallet tracking
- Price feed integration with Gemini
- Sentiment analysis and mention velocity tracking
- Automated alerting system
- Backtesting capabilities

## 🛠 Tech Stack

- Backend: Node.js + TypeScript + Express
- Frontend: Next.js + React Query + Tailwind CSS
- Database: TimescaleDB + pgVector
- AI: OpenAI GPT-4
- Containerization: Docker

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meme-coin-intel
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update the .env file with your API keys:
- OpenAI API key
- Twitter API credentials
- Gemini API keys
- Discord/Telegram tokens

4. Start the services using Docker:
```bash
docker-compose up -d
```

## 🔧 Development Setup

1. Install dependencies:
```bash
npm install
cd packages/backend && npm install
cd ../frontend && npm install
```

2. Start development servers:
```bash
# Start all services
npm run dev

# Or start individual services
cd packages/backend && npm run dev
cd packages/frontend && npm run dev
```

## 📊 System Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌────────────────┐
│  Data Ingestion │ ──► │  NLP Pipeline│ ──► │ Analytics      │
└─────────────────┘     └──────────────┘     └────────────────┘
         │                      │                     │
         │                      │                     │
         ▼                      ▼                     ▼
┌─────────────────────────────────────────────────────────┐
│                      TimescaleDB                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
└─────────────────────────────────────────────────────────┘
```

## 📝 API Documentation

### Analyze Social Media Post
```
POST /api/analyze
Content-Type: application/json

{
  "post": {
    "source": "twitter",
    "content": "Text content",
    "author": "username",
    "timestamp": "2023-01-01T00:00:00Z"
  }
}
```

### Get Mention Velocity
```
GET /api/mentions/:symbol
```

For complete API documentation, see [API.md](./API.md)

## 🔐 Security Considerations

- All API keys should be kept secure in environment variables
- Rate limiting is implemented on all endpoints
- Regular security audits are recommended
- Monitor for unusual API usage patterns

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.
