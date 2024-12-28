import { Express } from 'express';
import { OpenAIService } from '../services/nlp/openai';
import { MentionTracker } from '../services/analytics/mentionTracker';
import { AlertService } from '../services/alerting/alertService';

export const setupRoutes = (app: Express) => {
  const nlpService = new OpenAIService();
  const mentionTracker = new MentionTracker();
  const alertService = new AlertService();

  app.post('/api/analyze', async (req, res) => {
    try {
      const { post } = req.body;
      const [sentiment, scamAnalysis] = await Promise.all([
        nlpService.analyzeSentiment(post),
        nlpService.detectScam(post)
      ]);

      await mentionTracker.trackMention(post);

      if (scamAnalysis.isScam && scamAnalysis.confidence > 0.8) {
        await alertService.triggerAlert({
          type: 'SCAM_DETECTED',
          symbol: post.content.match(/\$(\w+)/)?.[1] || 'UNKNOWN',
          message: scamAnalysis.reason,
          severity: 'HIGH',
          timestamp: new Date()
        });
      }

      res.json({ sentiment, scamAnalysis });
    } catch (error) {
      res.status(500).json({ error: 'Analysis failed' });
    }
  });

  app.get('/api/mentions/:symbol', async (req, res) => {
    try {
      const velocity = await mentionTracker.getMentionVelocity(
        req.params.symbol,
        60 // 1 hour window
      );
      res.json({ velocity });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get mention velocity' });
    }
  });
};
