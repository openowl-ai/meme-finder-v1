import { pool } from '../../db';
import { AlertTrigger, AlertType, AlertHistory } from './types';
import { NotificationService } from './notification.service';

export class AlertTriggerService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async createTrigger(trigger: Omit<AlertTrigger, 'id' | 'status' | 'createdAt'>): Promise<AlertTrigger> {
    const query = `
      INSERT INTO alert_triggers (
        type, symbol, conditions, notifications, user_id, status, created_at, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, 'ACTIVE', NOW(), $6)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      trigger.type,
      trigger.symbol,
      JSON.stringify(trigger.conditions),
      JSON.stringify(trigger.notifications),
      trigger.userId,
      trigger.expiresAt
    ]);

    return result.rows[0];
  }

  async checkTriggers(data: {
    symbol: string;
    price: number;
    mentionVelocity: number;
    sentiment: number;
    scamProbability: number;
  }): Promise<void> {
    const query = `
      SELECT * FROM alert_triggers
      WHERE symbol = $1 AND status = 'ACTIVE';
    `;

    const triggers = await pool.query(query, [data.symbol]);

    for (const trigger of triggers.rows) {
      if (this.shouldTriggerAlert(trigger, data)) {
        await this.triggerAlert(trigger, data);
      }
    }
  }

  private shouldTriggerAlert(trigger: AlertTrigger, data: any): boolean {
    const { conditions } = trigger;

    // Check price conditions
    if (conditions.price) {
      const { value, condition } = conditions.price;
      if (!this.checkCondition(data.price, value, condition)) {
        return false;
      }
    }

    // Check mention velocity
    if (conditions.mentionVelocity) {
      const { value, condition } = conditions.mentionVelocity;
      if (!this.checkCondition(data.mentionVelocity, value, condition)) {
        return false;
      }
    }

    // Check sentiment
    if (conditions.sentiment) {
      const { value, condition } = conditions.sentiment;
      if (!this.checkCondition(data.sentiment, value, condition)) {
        return false;
      }
    }

    // Check scam probability
    if (conditions.scamProbability) {
      const { value, condition } = conditions.scamProbability;
      if (!this.checkCondition(data.scamProbability, value, condition)) {
        return false;
      }
    }

    return true;
  }

  private checkCondition(
    currentValue: number,
    targetValue: number,
    condition: string
  ): boolean {
    switch (condition) {
      case 'ABOVE':
        return currentValue > targetValue;
      case 'BELOW':
        return currentValue < targetValue;
      case 'CROSSES_ABOVE':
        // Would need historical data to implement crossing logic
        return currentValue > targetValue;
      case 'CROSSES_BELOW':
        // Would need historical data to implement crossing logic
        return currentValue < targetValue;
      default:
        return false;
    }
  }

  private async triggerAlert(trigger: AlertTrigger, data: any): Promise<void> {
    // Update trigger status
    const updateQuery = `
      UPDATE alert_triggers
      SET status = 'TRIGGERED'
      WHERE id = $1;
    `;
    await pool.query(updateQuery, [trigger.id]);

    // Record alert history
    const historyQuery = `
      INSERT INTO alert_history (
        trigger_id, type, symbol, triggered_at, data
      )
      VALUES ($1, $2, $3, NOW(), $4);
    `;
    await pool.query(historyQuery, [
      trigger.id,
      trigger.type,
      trigger.symbol,
      JSON.stringify(data)
    ]);

    // Send notifications
    await this.notificationService.sendAlertNotifications(trigger, data);
  }
}
