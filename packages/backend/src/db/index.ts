```typescript
    import { Pool } from 'pg';

    const pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    export const initializeDB = async () => {
      const client = await pool.connect();
      try {
        // Initialize TimescaleDB extension and tables
        await client.query(`
          CREATE EXTENSION IF NOT EXISTS timescaledb;
          CREATE EXTENSION IF NOT EXISTS vector;
          
          -- Create hypertables for time-series data
          CREATE TABLE IF NOT EXISTS social_mentions (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMPTZ NOT NULL,
            source TEXT NOT NULL,
            content TEXT NOT NULL,
            sentiment_score FLOAT,
            scam_probability FLOAT,
            embedding vector(1536)
          );

          CREATE TABLE IF NOT EXISTS user_alert_conditions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            symbol TEXT NOT NULL,
            condition_type TEXT NOT NULL,
            operator TEXT NOT NULL,
            threshold FLOAT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          
          SELECT create_hypertable('social_mentions', 'created_at', if_not_exists => TRUE);
        `);
      } finally {
        client.release();
      }
    };

    export { pool };

    ```
