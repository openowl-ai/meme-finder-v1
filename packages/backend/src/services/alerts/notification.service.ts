import nodemailer from 'nodemailer';
import { AlertTrigger } from './types';

export class NotificationService {
  private emailTransporter: nodemailer.Transporter;
  private telegramBot: any; // Would use actual Telegram bot SDK

  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      // Configure email transport
    });
  }

  async sendAlertNotifications(
    trigger: AlertTrigger,
    data: any
  ): Promise<void> {
    const promises: Promise<any>[] = [];

    if (trigger.notifications.email) {
      promises.push(this.sendEmailNotification(trigger, data));
    }

    if (trigger.notifications.telegram) {
      promises.push(this.sendTelegramNotification(trigger, data));
    }

    if (trigger.notifications.webhook) {
      promises.push(this.sendWebhookNotification(trigger, data));
    }

    await Promise.all(promises);
  }

  private async sendEmailNotification(
    trigger: AlertTrigger,
    data: any
  ): Promise<void> {
    const subject = `${trigger.type} Alert: ${trigger.symbol}`;
    const message = this.formatAlertMessage(trigger, data);

    await this.emailTransporter.sendMail({
      to: 'user@example.com', // Would get from user settings
      subject,
      html: message
    });
  }

  private async sendTelegramNotification(
    trigger: AlertTrigger,
    data: any
  ): Promise<void> {
    const message = this.formatAlertMessage(trigger, data);
    // Would use actual Telegram bot SDK to send message
  }

  private async sendWebhookNotification(
    trigger: AlertTrigger,
    data: any
  ): Promise<void> {
    if (!trigger.notifications.webhook) return;

    await fetch(trigger.notifications.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: trigger.type,
        symbol: trigger.symbol,
        data,
        triggeredAt: new Date().toISOString()
      })
    });
  }

  private formatAlertMessage(trigger: AlertTrigger, data: any): string {
    const type = trigger.type === 'WATCH' ? '👀' :
                 trigger.type === 'BUY' ? '🟢' : '🔴';

    return `
      <h2>${type} ${trigger.type} Alert: ${trigger.symbol}</h2>
      <p>Triggered at: ${new Date().toLocaleString()}</p>
      <h3>Current Data:</h3>
      <ul>
        <li>Price: $${data.price.toFixed(4)}</li>
        <li>Mention Velocity: ${data.mentionVelocity}/hour</li>
        <li>Sentiment Score: ${data.sentiment.toFixed(2)}</li>
        <li>Scam Probability: ${(data.scamProbability * 100).toFixed(1)}%</li>
      </ul>
    `;
  }
}
