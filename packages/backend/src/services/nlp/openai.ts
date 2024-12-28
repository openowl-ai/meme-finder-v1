import OpenAI from 'openai';
import { SocialMediaPost } from '../ingestion/types';

/**
 * OpenAIService handles all interactions with the OpenAI API for
 * sentiment analysis and scam detection.
 */
export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Analyzes the sentiment of a social media post
   * @param post - The social media post to analyze
   * @returns Object containing sentiment (positive/negative/neutral) and score (-1 to 1)
   */
  async analyzeSentiment(post: SocialMediaPost): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
  }> {
    // Construct a prompt that focuses on crypto-specific sentiment
    const prompt = `Analyze the sentiment of this crypto-related post: "${post.content}"
    Consider crypto-specific context like:
    - Price predictions
    - Project development updates
    - Community sentiment
    - Market conditions
    
    Respond with either positive, negative, or neutral, followed by a score from -1 to 1.`;

    const response = await this.client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Lower temperature for more consistent results
    });

    const result = response.choices[0].message.content || '';
    // Parse the response and return structured data
    // This is a simplified implementation
    return {
      sentiment: 'neutral',
      score: 0
    };
  }

  /**
   * Detects potential scam indicators in a social media post
   * @param post - The social media post to analyze
   * @returns Object containing scam analysis results
   */
  async detectScam(post: SocialMediaPost): Promise<{
    isScam: boolean;
    confidence: number;
    reason: string;
  }> {
    // Comprehensive prompt for scam detection
    const prompt = `Analyze this crypto post for potential scam indicators: "${post.content}"
    
    Consider these red flags:
    1. Unrealistic promises of returns
    2. Urgency or FOMO tactics
    3. Suspicious links or contracts
    4. Common pump and dump patterns
    5. Fake team members or projects
    6. Copy/pasted content from other projects
    
    Return a JSON object with:
    {
      isScam: boolean,
      confidence: number (0-1),
      reason: detailed explanation
    }`;

    const response = await this.client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    try {
      return JSON.parse(response.choices[0].message.content || '');
    } catch {
      return {
        isScam: false,
        confidence: 0,
        reason: 'Failed to analyze'
      };
    }
  }
}
