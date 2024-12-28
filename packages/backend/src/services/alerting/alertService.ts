interface Alert {
  type: 'SCAM_DETECTED' | 'HIGH_VELOCITY' | 'INFLUENCER_ACTIVITY';
  symbol: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: Date;
}

export class AlertService {
  private async sendSlackAlert(alert: Alert): Promise<void> {
    // Implementation for Slack webhook
    console.log('Slack alert:', alert);
  }

  private async sendTelegramAlert(alert: Alert): Promise<void> {
    // Implementation for Telegram bot
    console.log('Telegram alert:', alert);
  }

  async triggerAlert(alert: Alert): Promise<void> {
    await Promise.all([
      this.sendSlackAlert(alert),
      this.sendTelegramAlert(alert)
    ]);

    // Store alert in database
    const query = `
      INSERT INTO alerts (type, symbol, message, severity, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(query, [
      alert.type,
      alert.symbol,
      alert.message,
      alert.severity,
      alert.timestamp
    ]);
  }
}
