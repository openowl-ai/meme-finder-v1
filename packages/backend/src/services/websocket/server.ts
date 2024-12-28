import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { MentionTracker } from '../analytics/mentionTracker';
import { GeminiService } from '../price/gemini';

/**
 * WebSocket server for real-time updates
 */
export class WSServer {
  private wss: WebSocketServer;
  private mentionTracker: MentionTracker;
  private geminiService: GeminiService;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.mentionTracker = new MentionTracker();
    this.geminiService = new GeminiService();

    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws) => {
      console.log('Client connected');

      // Send initial data
      this.sendTrendingCoins(ws);
      this.sendPriceUpdates(ws);

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    // Start periodic updates
    this.startPeriodicUpdates();
  }

  private async sendTrendingCoins(ws: WebSocket) {
    try {
      const trending = await this.mentionTracker.getTrendingSymbols();
      ws.send(JSON.stringify({
        type: 'trending',
        data: trending
      }));
    } catch (error) {
      console.error('Error sending trending coins:', error);
    }
  }

  private async sendPriceUpdates(ws: WebSocket) {
    try {
      const symbols = ['BTCUSD', 'ETHUSD']; // Add more as needed
      const prices = await Promise.all(
        symbols.map(symbol => this.geminiService.getCurrentPrice(symbol))
      );

      ws.send(JSON.stringify({
        type: 'prices',
        data: prices
      }));
    } catch (error) {
      console.error('Error sending price updates:', error);
    }
  }

  private startPeriodicUpdates() {
    // Update trending coins every 30 seconds
    setInterval(() => {
      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          this.sendTrendingCoins(client);
        }
      });
    }, 30000);

    // Update prices every 5 seconds
    setInterval(() => {
      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          this.sendPriceUpdates(client);
        }
      });
    }, 5000);
  }
}
