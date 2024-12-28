import { pool } from '../../db';
import { AlertType } from './types';

interface AlertPerformance {
  id: number;
  triggerId: number;
  type: AlertType;
  symbol: string;
  triggeredAt: Date;
  outcome: 'SUCCESS' | 'FAILURE' | 'PENDING';
  priceAtTrigger: number;
  currentPrice: number;
  pnl?: number;
  validationData: {
    price?: number;
    mentionVelocity?: number;
    sentiment?: number;
    scamProbability?: number;
  };
}

export class AlertPerformanceService {
  async calculatePerformance(
    startDate: Date,
    endDate: Date
  ): Promise<{
    overall: {
      successRate: number;
      totalAlerts: number;
      avgPnl: number;
    };
    byType: Record<AlertType, {
      successRate: number;
      totalAlerts: number;
      avgPnl: number;
    }>;
    bySymbol: Record<string, {
      successRate: number;
      totalAlerts: number;
      avgPnl: number;
    }>;
  }> {
    const query = `
      WITH alert_outcomes AS (
        SELECT 
          ah.type,
          ah.symbol,
          ah.outcome,
          ah.pnl,
          DATE_TRUNC('day', ah.triggered_at) as alert_date
        FROM alert_history ah
        WHERE ah.triggered_at BETWEEN $1 AND $2
      )
      SELECT 
        type,
        symbol,
        COUNT(*) as total_alerts,
        COUNT(*) FILTER (WHERE outcome = 'SUCCESS') as successful_alerts,
        AVG(pnl) as average_pnl
      FROM alert_outcomes
      GROUP BY GROUPING SETS (
        (), 
        (type),
        (symbol)
      );
    `;

    const result = await pool.query(query, [startDate, endDate]);
    return this.processPerformanceData(result.rows);
  }

  async getPerformanceTimeline(
    startDate: Date,
    endDate: Date
  ): Promise<Array<{
    date: Date;
    successRate: number;
    alertCount: number;
    avgPnl: number;
  }>> {
    const query = `
      WITH daily_stats AS (
        SELECT 
          DATE_TRUNC('day', triggered_at) as date,
          COUNT(*) as alert_count,
          COUNT(*) FILTER (WHERE outcome = 'SUCCESS') as success_count,
          AVG(pnl) as avg_pnl
        FROM alert_history
        WHERE triggered_at BETWEEN $1 AND $2
        GROUP BY DATE_TRUNC('day', triggered_at)
      )
      SELECT 
        date,
        alert_count,
        (success_count::float / alert_count) as success_rate,
        avg_pnl
      FROM daily_stats
      ORDER BY date;
    `;

    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  private processPerformanceData(rows: any[]) {
    const overall = rows.find(row => !row.type && !row.symbol);
    const byType = rows
      .filter(row => row.type && !row.symbol)
      .reduce((acc, row) => ({
        ...acc,
        [row.type]: {
          successRate: row.successful_alerts / row.total_alerts,
          totalAlerts: row.total_alerts,
          avgPnl: row.average_pnl
        }
      }), {});

    const bySymbol = rows
      .filter(row => row.symbol)
      .reduce((acc, row) => ({
        ...acc,
        [row.symbol]: {
          successRate: row.successful_alerts / row.total_alerts,
          totalAlerts: row.total_alerts,
          avgPnl: row.average_pnl
        }
      }), {});

    return {
      overall: {
        successRate: overall.successful_alerts / overall.total_alerts,
        totalAlerts: overall.total_alerts,
        avgPnl: overall.average_pnl
      },
      byType,
      bySymbol
    };
  }

  async validateAlertOutcome(alertId: number): Promise<void> {
    const query = `
      UPDATE alert_history
      SET 
        outcome = CASE 
          WHEN pnl > 0 THEN 'SUCCESS'
          ELSE 'FAILURE'
        END,
        validated_at = NOW()
      WHERE id = $1;
    `;

    await pool.query(query, [alertId]);
  }
}
