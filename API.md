# API Documentation

## Authentication

All API endpoints require an API key passed in the header:
```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Social Media Analysis

#### Analyze Post
```
POST /api/analyze
```

Analyzes a social media post for sentiment and scam detection.

**Request Body:**
```json
{
  "post": {
    "source": "twitter",
    "content": "string",
    "author": "string",
    "timestamp": "ISO-8601 date string"
  }
}
```

**Response:**
```json
{
  "sentiment": {
    "sentiment": "positive" | "negative" | "neutral",
    "score": number
  },
  "scamAnalysis": {
    "isScam": boolean,
    "confidence": number,
    "reason": "string"
  }
}
```

#### Get Mention Velocity
```
GET /api/mentions/:symbol
```

Returns the mention velocity for a given symbol.

**Parameters:**
- symbol: Cryptocurrency symbol (e.g., "BTC")

**Response:**
```json
{
  "velocity": number
}
```

[Additional endpoint documentation...]
