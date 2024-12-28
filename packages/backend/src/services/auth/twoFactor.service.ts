```typescript
    import * as notp from 'notp';
    import * as qrcode from 'qrcode';
    import { pool } from '../../db';

    export class TwoFactorAuthService {
      async generateSecret(userId: number): Promise<{ secret: string; qrCodeUrl: string }> {
        const secret = notp.totp.genSecret();
        const otpauthUrl = `otpauth://totp/MemeCoinIntel:${userId}?secret=${secret.base32}&issuer=MemeCoinIntel`;
        const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

        // Store the secret in the database
        const query = `
          UPDATE users
          SET two_factor_secret = $1
          WHERE id = $2;
        `;
        await pool.query(query, [secret.base32, userId]);

        return { secret: secret.base32, qrCodeUrl };
      }

      async verifyToken(userId: number, token: string): Promise<boolean> {
        const query = `
          SELECT two_factor_secret
          FROM users
          WHERE id = $1;
        `;
        const result = await pool.query(query, [userId]);
        const secret = result.rows[0]?.two_factor_secret;

        if (!secret) {
          return false;
        }

        const isValid = notp.totp.verify(token, secret);
        return isValid !== null;
      }

      async enableTwoFactor(userId: number): Promise<void> {
        const query = `
          UPDATE users
          SET two_factor_enabled = TRUE
          WHERE id = $1;
        `;
        await pool.query(query, [userId]);
      }

      async disableTwoFactor(userId: number): Promise<void> {
        const query = `
          UPDATE users
          SET two_factor_enabled = FALSE, two_factor_secret = NULL
          WHERE id = $1;
        `;
        await pool.query(query, [userId]);
      }
    }

    ```
