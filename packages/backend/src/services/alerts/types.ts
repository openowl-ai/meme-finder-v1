export type AlertType = 'WATCH' | 'BUY' | 'SELL';
export type AlertStatus = 'ACTIVE' | 'TRIGGERED' | 'EXPIRED';
export type TriggerCondition = 'ABOVE' | 'BELOW' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';

export interface AlertTrigger {
  type: AlertType;
  symbol: string;
  conditions: {
    price?: {
      value: number;
      condition: TriggerCondition;
    };
    mentionVelocity?: {
      value: number;
      condition: TriggerCondition;
    };
    sentiment?: {
      value: number;
      condition: TriggerCondition;
    };
    scamProbability?: {
      value: number;
      condition: TriggerCondition;
    };
  };
  notifications: {
    email?: boolean;
    telegram?: boolean;
    webhook?: string;
  };
  userId: number;
  status: AlertStatus;
  createdAt: Date;
  expiresAt?: Date;
}

export interface AlertHistory {
  id: number;
  triggerId: number;
  type: AlertType;
  symbol: string;
  triggeredAt: Date;
  data: {
    price?: number;
    mentionVelocity?: number;
    sentiment?: number;
    scamProbability?: number;
  };
}
