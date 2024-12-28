import { pool } from '../../db';
import { SocialMediaPost } from '../ingestion/types';

/**
 * MentionTracker handles tracking and analyzing mention velocity
 * for cryptocurrency symbols across social media platforms.
 */
export class MentionTracker {
  /**
   * Tracks a new mention in the database
   * @param post - The social media post containing the mention
   */
  async trackMention(post: SocialMediaPost): Promise<void> {
    // Store mention with timestamp for time-series analysis
    const query = `
      INSERT INTO social_mentions 
      (created_at, source, content, sentiment_score)
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(query, [
      post.timestamp,
      post.source,
      post.content,
      0 // Will be updated by sentiment analysis
    ]);
  }

  /**
   * Calculates the mention velocity (mentions per hour) for a given symbol
   * @param symbol - The cryptocurrency symbol to analyze
   * @param timeWindowMinutes - The time window to analyze in minutes
   * @returns The mention velocity (mentions per hour)
   */
  async getMentionVelocity(
    symbol: string,
    timeWindowMinutes: number
  ): Promise<number> {
    // Use TimescaleDB time-bucket function for efficient time-series analysis
    const query = `
      SELECT 
        time_bucket('1 hour', created_at) AS bucket,
        COUNT(*) / ($2 / 60.0) as velocity
      FROM social_mentions
      WHERE 
        created_at >= NOW() - interval '1 minute' * $2
        AND content ILIKE $1
      GROUP BY bucket
      ORDER BY bucket DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [
      `%${symbol}%`,
      timeWindowMinutes
    ]);

    return parseFloat(result.rows[0]?.velocity || '0');
  }

  /**
   * Gets trending symbols based on mention velocity
   * @param limit - Maximum number of trending symbols to return
   * @returns Array of trending symbols with their velocities
   */
  async getTrendingSymbols(limit: number = 10): Promise<Array<{
    symbol: string;
    velocity: number;
  }>> {
    // Implementation for trending symbols
    return [];
  }
}
